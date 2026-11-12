#!/usr/bin/env node
// PreToolUse hook (Edit|Write|MultiEdit|NotebookEdit).
// AGENTS.md requires reading the matching rules/*.mdc before editing a file.
// This hook surfaces those rules, plus the AGENTS.md section 5.7 data-path
// review levels, as context the first time a session edits a matching file.
// It never blocks a tool call: any failure exits 0 with no output.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, isAbsolute } from "node:path";

function globToRegExp(glob) {
  let re = "";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === "*") {
      if (glob[i + 1] === "*") {
        re += ".*";
        i++;
        if (glob[i + 1] === "/") i++;
      } else {
        re += "[^/]*";
      }
    } else if (c === "?") {
      re += "[^/]";
    } else {
      re += c.replace(/[.+^${}()|[\]\\]/g, "\\$&");
    }
  }
  return new RegExp(`^${re}$`);
}

function scopedRules(root) {
  const dir = join(root, "rules");
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".mdc")) continue;
    const text = readFileSync(join(dir, name), "utf8");
    const fm = /^---\n([\s\S]*?)\n---/.exec(text);
    if (!fm) continue;
    const globs = /^globs:\s*(.+)$/m.exec(fm[1]);
    if (!globs) continue; // alwaysApply rules are covered by AGENTS.md itself
    const description = /^description:\s*(.+)$/m.exec(fm[1])?.[1]?.trim() ?? "";
    const patterns = globs[1].trim().replace(/^["']|["']$/g, "").split(",").map((g) => g.trim()).filter(Boolean);
    out.push({ id: `rules/${name}`, description, patterns: patterns.map(globToRegExp) });
  }
  return out;
}

const DATA_PATHS = [
  {
    id: "data-path:telemetry",
    description:
      "Telemetry path (AGENTS.md 5.7, strict review): update the generated contract first, update packages/shared/src/telemetry/README.md in the same PR, and request a privacy review.",
    patterns: ["packages/shared/src/telemetry/**"].map(globToRegExp),
  },
  {
    id: "data-path:observability",
    description:
      "Observability path (AGENTS.md 5.7, lighter review): keep the operator OTLP endpoint gate and the no-op tracer when no endpoint is set; stay inside the closed span-attribute allowlist.",
    patterns: [
      "server/src/instrumentation.ts",
      "doc/observability.md",
      "packages/adapter-utils/src/duplex-observability.ts",
      "server/src/services/duplex-observability-recorder.ts",
      "packages/adapter-utils/src/acpx-engine/startup-timing.ts",
    ].map(globToRegExp),
  },
];

try {
  const input = JSON.parse(readFileSync(0, "utf8") || "{}");
  const filePath = input?.tool_input?.file_path ?? input?.tool_input?.notebook_path;
  if (!filePath) process.exit(0);
  const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
  const rel = (isAbsolute(filePath) ? relative(root, filePath) : filePath).split("\\").join("/");
  if (rel.startsWith("..")) process.exit(0);

  const matches = [...scopedRules(root), ...DATA_PATHS].filter((r) => r.patterns.some((p) => p.test(rel)));
  if (matches.length === 0) process.exit(0);

  // Remind once per rule per session.
  const stateDir = join(tmpdir(), "paperclip-claude-hooks");
  mkdirSync(stateDir, { recursive: true });
  const stateFile = join(stateDir, `${String(input.session_id ?? "nosession").replace(/[^\w-]/g, "_")}.json`);
  const seen = new Set(existsSync(stateFile) ? JSON.parse(readFileSync(stateFile, "utf8")) : []);
  const fresh = matches.filter((m) => !seen.has(m.id));
  if (fresh.length === 0) process.exit(0);
  for (const m of fresh) seen.add(m.id);
  writeFileSync(stateFile, JSON.stringify([...seen]));

  const lines = fresh.map((m) => (m.id.startsWith("rules/") ? `- ${m.id}: ${m.description} Read it before this edit if you have not.` : `- ${m.description}`));
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        additionalContext: `Repository rules apply to ${rel}:\n${lines.join("\n")}`,
      },
    }),
  );
} catch {
  // Never block edits on a hook failure.
}
process.exit(0);

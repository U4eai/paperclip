---
name: repo-change
description: Orchestrate a code change in the Paperclip repository end to end — read the required docs and matching rules, plan, implement, then run the invariants-reviewer and verifier subagents in parallel, fix what they find, and hand off. Use for any feature, fix or refactor in this repo that touches server, ui, packages or cli.
---

# Paperclip repo change workflow

Follow these phases in order. `AGENTS.md` is the source of truth; this skill only sequences it.

## 1. Ground

- Read the docs `AGENTS.md` section 2 lists, as far as the change needs (`doc/SPEC-implementation.md` for behavior, `doc/DATABASE.md` for schema work, `DESIGN.md` for UI).
- List the files you expect to touch and read every `rules/*.mdc` whose `globs` match them. The project `PreToolUse` hook reminds you on first edit, but read them before planning.
- Classify any observability/telemetry-sounding work by path (AGENTS.md 5.7).
- For an Apps catalog connection, follow `doc/connections/CONNECTOR-PLAYBOOK.md` instead of improvising.

## 2. Plan

- For a multi-layer change, write down each layer the contract crosses (db → shared → server → ui) before editing.
- For broad work spanning independent areas, use the `Explore` agent for fan-out search rather than reading every file yourself.
- Plan documents committed to the repo go in `doc/plans/YYYY-MM-DD-slug.md`.

## 3. Implement

- Keep every change company-scoped, keep contracts synchronized, and log activity for mutations.
- Schema changes: edit `packages/db/src/schema/*.ts`, export new tables from `index.ts`, then `pnpm db:generate`.
- UI changes: tokens only; run `pnpm check:token-gates` before committing.

## 4. Review and verify (parallel)

Launch both subagents in one message so they run concurrently:

- `invariants-reviewer` — pass the base ref or file list and a one-line summary of intent.
- `verifier` — pass the same files; say "PR-ready" if this is the final hand-off so it runs the full check.

Fix every verified finding and every failure, then re-run only the affected checks. Do not skip, disable or loosen a test to get green.

## 5. Hand off

- Report what was and was not run, with real results.
- Commit only when asked. A PR must fill every section of `.github/PULL_REQUEST_TEMPLATE.md`, including Model Used.

# MCP connector brand assets

Retrieved 2026-09-21 from the providers’ own sites for the independent connector
design review. Brand-library membership does not publish a catalog connector.
The four connectors are available for setup by default. No experimental flag is required.
Zapier and Composio reuse the existing reviewed local marks.

| File | Source | SHA-256 |
| --- | --- | --- |
| `ui/public/brands/apps/arcade.png` | [Arcade site touch icon](https://www.arcade.dev/_astro/webclip.BYnZsC5R.png), linked from [arcade.dev](https://www.arcade.dev/) | `5b3704e210b6dc70fffab260d5416624f37db19108399a6d2c18c848d33465ad` |
| `ui/public/brands/apps/executor.png` | [Executor site icon](https://executor.sh/favicon-192.png), linked from [executor.sh](https://executor.sh/) | `e5fd761a0cd80d51d451cc06e9e6d0236dcc39317248a13ac5db5fcf4d52d0ca` |
| `ui/public/brands/apps/telem.svg` | [Telem.AI mark](https://telem.ai/logos/telem-icon.svg), published on [telem.ai](https://telem.ai/) (retrieved 2026-10-06) | `c65ebca449f1c5ceef874ac912ea43c919315f465304a2f9e63f5d04ac0d769d` |
| `ui/public/brands/apps/telem-dark.svg` | [Telem.AI dark mark](https://telem.ai/logos/telem-icon-dark.svg), published on [telem.ai](https://telem.ai/) (retrieved 2026-10-06) | `a2735231c47371c9247ffb9168ab0c2e684403d7c4d94a6ba9f48a71bbd14145` |

Both files preserve provider artwork without recoloring. Both Telem.AI files are byte-identical to the published files: `telem-dark.svg` is Telem.AI's own published dark variant, not a recolor. The shared AppLogo
provides the standard gray frame and contained padding. Arcade’s SVG favicon
wrapped embedded raster content; the 180px touch icon linked by the same official
page was used to satisfy the repository’s artwork safety checks.

## 2026-11-10 additions

Retrieved 2026-11-10 from each provider's own published assets. Files are
byte-identical to the published files; none are recolored or resized.

| File | Source | SHA-256 |
| --- | --- | --- |
| `ui/public/brands/apps/mitosis.png` | [Mitosis app icon](https://mitosislabs.ai/mitosis-app-icon-512w.png), declared as the organization logo on [mitosislabs.ai](https://mitosislabs.ai/) | `44c920b9d6a68200e4f159a08c006b4933711a357f573718f33a6979ab5a0224` |
| `ui/public/brands/apps/8raise.png` | [8Raise mark](https://8raise.com/8raise-mark.png), declared as `logo_uri` in [8Raise's MCP protected-resource metadata](https://mcp.8raise.com/.well-known/oauth-protected-resource) | `02a3306e11c8d509c0762e83fab069ffc79910f5388903d4b39d29a0cb1e5351` |
| `ui/public/brands/apps/stack-ai.png` | [StackAI light-scheme site icon](https://framerusercontent.com/images/CdmJotf8x1dzeIh0S4a5ce9ZFwo.png), linked from [stack-ai.com](https://www.stack-ai.com/) | `a5d14c9fff3a97de74fb13f478550ecf3ed40d9e2726ffccfa5c203ba2b48882` |

All three are opaque rounded-tile marks that keep contrast on both frames, so no
dark variants are added.

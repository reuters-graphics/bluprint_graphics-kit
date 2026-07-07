---
'@reuters-graphics/graphics-kit': minor
---

Redesign the `bin/mods/` module. Mods are now driven by a single registry, share a
`ModContext` (validated project root, cancellation-aware prompts, transactional file
operations), and support a global `--dry-run` flag that previews changes without writing.
The `project-type` mod no longer mutates its own template directory to track state — it
detects the current type from the project and renders both variants from inert templates.
File changes now apply atomically with rollback, so an interrupted mod leaves the project
untouched rather than half-converted. Public commands (`pnpm mods`, `pnpm stories:unconfig`)
are unchanged.

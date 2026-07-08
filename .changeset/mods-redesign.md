---
'@reuters-graphics/graphics-kit': minor
---

Redesign the `bin/mods/` module for maintainability and safety.

- Mods are driven by a single registry that builds both the interactive `pnpm mods` menu and the dedicated commands, and share a `ModContext` (validated project root, cancellation-aware prompts, transactional file operations).
- File changes apply atomically: every operation is staged and rolled back on error, so an interrupted mod leaves the project untouched rather than half-converted. Orphaned staging dirs from hard-killed runs are swept on a later run.
- A global `--dry-run` flag previews the exact file changes without writing.
- `project-type` no longer mutates its own template directory to track state — it detects the current type from the project and renders both variants from inert templates.
- Template directories now mirror the project's root-relative structure (with SvelteKit-style `[locale]`/`[slug]` placeholders where destinations are dynamic), and mods build explicit per-file copy operations.
- A drift-guard test fails if the `pages-plus` templates ever fall out of sync with the live project files they mirror.

Public commands (`pnpm mods`, `pnpm stories:unconfig`) are unchanged.

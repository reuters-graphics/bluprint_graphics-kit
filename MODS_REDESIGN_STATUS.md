# TEMP: `bin/mods/` redesign status

> Delete this file before merging. Scratch notes for the `refactor/mods-redesign` branch.

## State: complete, verified, not yet PR'd

All work is committed on `refactor/mods-redesign`. Full plan lives at
`~/.claude/plans/swift-finding-bentley.md`.

## What changed

- **`_core/` toolkit** (`bin/mods/_core/`):
  - `plan.ts` — declarative `FileOp` union + `applyPlan()` with temp-dir staging and
    **rollback on error**; honors `--dry-run`.
  - `context.ts` / `cancel.ts` — `ModContext` (validated root, cancel-aware prompts,
    `apply()`); one `CancelledError` caught at the CLI top.
  - `locations.ts` (validated `resolveProjectRoot`), `dirname.ts`, `constants.ts`
    (`LOCALES`), lazy `pkg.ts`.
- **`registry.ts`** — single source of truth; `index.ts` builds menu + commands from it.
- **`mods/`** — the four mods rewritten: `project-type` (state read from project, inert
  templates, transactional, overwrites on switch), `make-ai-embed`, `export-ai-statics`,
  `unconfig-rngs-io`.
- **Deleted** `_utils/` (`Mod`, `FileMover`, `MagicFile`) and the old flat mod dirs.
- Captured a real `templates/pages-plus/` variant (previously empty dirs).
- Changeset: `.changeset/mods-redesign.md` (minor).

## Verified

- `npx vitest run bin/mods` → 19 tests pass (incl. real `vite build` round-trips).
- `pnpm check` clean, `eslint bin/mods` clean.
- Manual `tsx ./bin/mods/index.ts project-type --dry-run` / `unconfig-rngs-io --dry-run`
  wrote nothing; not-a-project guard + `--help` work.

## Left to do

- [ ] Open PR (`refactor/mods-redesign` → `main`).
- [ ] Delete this file.
- [ ] Note: `.claude/settings.json` was untracked and NOT authored by this work — left alone.

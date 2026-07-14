---
name: wire-blocks
description: Use when asked to wire rngs.io content blocks into App.svelte, or convert/update it from content.json.
allowed-tools: Read Edit Write Grep Glob Bash AskUserQuestion
---

## Instructions

Read `.claude/context/content.md` first — it defines the content block shape and the pairing convention this skill implements. Also read `.claude/context/assets.md#local-assets-vs-external-urls` — it distinguishes local asset paths from external URLs, which step 5 wires differently.

Every prop value wired into `App.svelte` comes from `locales/en/content.json` (or the file named in step 2). When a field's prop mapping or a block's matching component is unclear, skip that field or block (fallback/skip per steps 5–6) or ask the user.

`locales/en/content.json` is synced from rngs.io — treat it as read-only. When new content fields are needed, tell the user what ArchieML to add in rngs.io instead (see `.claude/llms/archieml/docs.md`).

Keep `block` loosely typed and access fields directly as `block.<field>` — no per-block-type interfaces, and leave `block` itself uncast. Because `content.json`'s inferred type is loose CMS data, some lines will carry TS/ESLint diagnostics (e.g. `string | undefined` into a required prop); leave those in place. An inline `as` cast on a single _derived_ value is fine — e.g. narrowing a shared helper's return type to a component's narrower prop type. That narrows one value; it isn't shaping the block.

1. Run `pnpm stories:sync` to ensure `locales/en/content.json` is up to date with the latest content from rngs.io. If `pnpm stories:sync` fails or the command is not found, warn the user and exit without making any changes.
2. Read `locales/en/content.json`. The blocks to wire live at `story.blocks` (or top-level `blocks` if there's no `story` wrapper). Note every distinct `type` present. For each `src`-like field (`src`, `poster`, etc.), look at its actual value(s) to tell a local path from an external URL — the field name alone doesn't. If `locales/en/content.json` is not present, ask the user which file to use instead.
3. Before writing any code, check that the blocks array isn't malformed: it must be an array, and every entry must be an object with a `type` string. If it isn't — e.g. a block is missing `type`, a block came through as a string/null instead of an object, or entries bled into each other — this is almost always the rngs.io doc, not this skill: a missing `:end` closing a multi-line field, or a missing `[]` closing the `[blocks]` array. Warn the user with `AskUserQuestion`, naming the specific block (index and what's wrong with it) and the likely ArchieML fix, and ask whether to proceed anyway. Only continue if they confirm.

   Also check for a `type` key sitting directly on `story` itself (outside `blocks`) — `story` never has its own `type` field, so this means a whole block leaked out of the `[blocks]` array, usually because `[]` closed the array before that block's `type:` line was written. Warn the user with `AskUserQuestion`, naming the leaked fields and the likely ArchieML fix (move the fields back inside `[blocks]`, closing `[]` after the new block instead of before it).

4. Read the current `src/lib/App.svelte` to see which block types are already handled in the `{#each content.blocks as block}` loop and which components are already imported.
5. For each block type with no matching `{:else if}` branch:
   - Find the matching component in `@reuters-graphics/graphics-components` — check `.claude/llms/graphics-components/components/index.md` for the component list, then its individual doc for props. The docs aren't exhaustive (a component can share a source file/export group with another and be missing from `index.md`), so when a block type's shape could match more than one export, grep `node_modules/@reuters-graphics/graphics-components/dist/index.d.ts` for related exports before settling on the one from the docs.
   - When more than one component could plausibly render a block type (e.g. a block-level wrapper vs. a single-item version), ask the user with `AskUserQuestion`, describing what each option renders, and use their answer.
   - When no matching component exists, skip the block type, let the `{:else}` fallback handle it, and report it to the user as unhandled.
   - Add the component to the import statement.
   - Add an `{:else if block.type === '<type>'}` branch passing the block's properties as props, matching prop names/types from the component's docs. A content field maps to a prop when the name matches exactly or is an unambiguous variant (abbreviation, casing, missing word — e.g. `handleClr` → `handleColour`, `img` → `image`). When it's genuinely unclear which prop a field is for, leave that field out and tell the user.
   - When a content field is a plain string but the matching prop's type is `Snippet`, wrap it in the simplest tag that fits the prop's purpose (e.g. `{#snippet caption()}<p>{block.caption}</p>{/snippet}`) — one wrapper tag, no extra markup, classes, or styling.
   - For any `src`-like prop, check every instance of that block type in `content.json`, not just the first, then wire by what you observe:
     - All local paths → one branch wrapping the value in `asset()` from `$app/paths`. Check each local path exists under `src/statics/` — wire it regardless, but note any missing file for the step 7 report.
     - All external URLs → one branch passing the value through unresolved (external URLs stay unwrapped).
     - Both kinds present → add `{:else if block.type === '<type>' && isExternalUrl(block.src)}` (pass through) _before_ the `asset()` branch. Add the `isExternalUrl()` branch only when you actually observe both kinds — a later sync triggers the split, not this run.
6. Leave the final `{:else}` fallback (e.g. `LogBlock` for unknown types) in place.
7. After editing, report which block types were newly wired and which components they map to. Include a warning for any local asset path noted missing in step 5, naming the block type and path, so the user knows rendering may break until the file is added.
8. When the task is a full convert/update of `App.svelte` (not a targeted request to wire specific blocks), also check the reverse case: for each `{:else if block.type === '<type>'}` branch already in `App.svelte`, confirm `<type>` still appears among the block types noted in step 2. When a branch's type no longer appears in `content.json`, list those orphaned types for the user with `AskUserQuestion` (multi-select, one per orphaned type) asking which to remove. For each the user selects, delete that `{:else if}` branch and drop its component import if no other branch still uses it.

---
name: screenshot-embeds
description: Use when asked to screenshot, regenerate, update, or review embed share images for a graphics-kit project.
argument-hint: '[optional --viewports JSON]'
allowed-tools: Read Edit Write Bash
---

## Instructions

Use this skill to capture share-image screenshots for every embeddable page in a graphics-kit project and wire those screenshots into each embed page's `SEO` metadata.

### Step 1: Inspect the project and current embed metadata

1. Read `.claude/context/routing.md` and `.claude/context/assets.md` for the current embed and asset conventions.
2. Find embed pages under `pages/embeds/<locale>/<slug>/+page.svelte`.
3. Inspect each embed page's `SEO` component, especially `shareImgPath`, `shareImgAlt`, `shareImgWidth`, and `shareImgHeight`.
4. If there are no embed pages, stop and tell the user no screenshots were generated.

### Step 2: Run the screenshot script

From the project root, run:

```sh
node .claude/skills/screenshot-embeds/scripts/screenshot.mjs
```

If the user supplied viewport overrides, pass them through exactly, for example:

```sh
node .claude/skills/screenshot-embeds/scripts/screenshot.mjs \
  --viewports '{"en/homepage-strip": {"width": 600, "height": 600}}'
```

The script will:

- discover embed pages under `pages/embeds/<locale>/<slug>/+page.svelte`
- start a local Vite dev server
- capture each embed with a default `1200x628` viewport unless overridden
- save screenshots to `src/statics/images/embeds/<locale>/<slug>.png`

### Step 3: Review generated screenshots

Open/read each generated PNG so the user can visually review the results. If a screenshot is blank, cropped incorrectly, or obviously still loading, rerun with a more appropriate viewport override or report the issue.

### Step 4: Wire screenshots into embed SEO

For each embed page whose `SEO` component still points at a generic or missing share image, update it to reference the generated screenshot with SvelteKit's `asset` helper:

```svelte
<script lang="ts">
  import { asset } from '$app/paths';
</script>

<SEO
  shareImgPath={asset('/images/embeds/en/map.png')}
  shareImgWidth={1200}
  shareImgHeight={628}
/>
```

Keep existing specific share images when the page already points to a deliberate, non-placeholder file. Do not change unrelated page metadata.

### Step 5: Validate and report

Run the smallest relevant validation for the files changed, usually:

```sh
pnpm check
pnpm test -- --run
```

If you changed formatting-sensitive files, also run Prettier on the touched files or `pnpm format` if appropriate.

Report:

- embed pages discovered
- screenshots written
- metadata files updated
- validation commands and results
- any screenshots that need human visual judgment or a custom viewport

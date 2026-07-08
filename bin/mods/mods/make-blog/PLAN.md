# `make-blog` mod — plan (WORKING DOC)

> Temporary planning doc for the `feat/make-blog-mod` branch. Delete before merging.
> Edit freely — we'll refine this together, resolve the open questions, then implement.

## Context

A new `kit-mod` that converts a freshly scaffolded (pages-plus) graphics project into a **graphics
blog**: one main page that renders every _post_ in reverse-chronological order, plus a per-post
permalink route so individual posts are crawlable/shareable. Derived from the already-formatted
example at `/Users/a6108129/Scripts/graphics_2026-iran-us-glog/`, reading past its Iran-war content
to extract the reusable scaffolding.

The mod plugs into the existing `bin/mods/` framework (registry + `ModContext` + transactional
`applyPlan` + `templateCopyOp`). It is a **one-way** transformation (no "un-blog"), unlike the
reversible `project-type` mod.

## How the blog works (the model to template)

- **Posts are data, not routes.** Each post is `locales/en/post-<N>.json` (a standard ArchieML story:
  `title`, `slugTitle`, `authors[]`, `publishedDate`, `updatedDate`, `blocks[]`). `content.json` becomes
  a **page shell** (`metadata` + `story` with SEO/share, `section`, `mainHeadline`, `endNotes[]`, **no
  blocks**).
- **Engine — `pages/+layout.server.ts`:** `import.meta.glob('locales/en/*.json', '!content.json')`, map each to
  `.story`, sort by `publishedDate` desc → `{ posts }`. Drop in a new `post-N.json` and it appears
  automatically. Sets `prerender = true`, `trailingSlash = 'always'`.
- **Main page — `pages/+page.svelte`:** `<SEO>`, headline from `content.mainHeadline`, `<BlogTOC>`, then
  `{#each data.posts as post, i}<Post content={post} isLastPost={…} />`, then `<EndNotes>`.
- **Permalink route — `pages/[date]/[slug]/`:** `+page.ts` finds the post whose
  `slugify(slugTitle) === params.slug` from the parent `posts`; `+page.svelte` renders `<SEO>` + one
  `<Post>` and, for real users (not bots), `goto(`${base}/#${slug}`)`. Routes prerender because
  `<BlogPost>` emits a hidden crawlable `<a href="{base}/{YYYY-MM-DD}/{slug}/">` the crawler follows.
- **`src/lib/Post.svelte`** (reconfigured `App.svelte`): renders one post via the library's `<BlogPost>`
  (`title`, `slugTitle`, `authors`, `publishTime`, `updateTime`, `base`, `isLastPost`) with a block switch.
- **`slugify`** must equal the library's internal slug (`slugify(s,{lower:true,strict:true})` from the
  `slugify` npm package) or permalinks/anchors won't match. (`graphics-components@^3.10.1` already exports
  `BlogPost`, `BlogTOC`, `ClockWall`, `Headline`, and a matching `slugify`.)

## Base scaffold prerequisite (not part of the mod)

Add a standing `src/utils/slugify/index.ts` to the **base scaffold** (committed to this repo), and add
`slugify` to the base `package.json` dependencies. Impl (matches `<BlogPost>`'s internal slug exactly so
permalinks/anchors line up):

```ts
import slug from 'slugify';
/** Convert a string into a URL-friendly slug. */
export const slugify = (str: string) =>
  slug(str, { lower: true, strict: true });
```

The library does **not** publicly export its `slugify` (its `exports` map blocks deep imports), so we own
this util. It's imported as `$utils/slugify`. Because it ships in the base scaffold, the mod neither
templates the util nor adds the dep. _(Optional: consider migrating `make-ai-embed`'s
`@sindresorhus/slugify` usage to this util later; out of scope here.)_

## Design: a standalone one-way mod

Add `make-blog` to the registry (`menu: true`, plus a `make-blog` command). Detects state and refuses to
run twice; not meant to be combined with `project-type` afterward.

### Templates (mirror project root, per our convention)

`bin/mods/mods/make-blog/templates/` — every file genericized (strip all Iran content, project
charts/components, and the ~40 `aiCharts` entries down to `{ AiMap }`):

- `pages/+layout.svelte` — site chrome (SiteHeader/SiteFooter/Theme/Article + Reuters-app detection).
- `pages/+layout.server.ts` — server-only glob+sort engine (build-time; keeps post JSON out of the client
  bundle since all projects prerender). Replace the example's `import post from '…/post-1.json'` type
  hack with the shared post type below.
- `pages/+page.svelte` — main feed. **Keep `<ClockWall>`**, but set it to three generic cities the user
  can change later: **Singapore, London, New York**.
- `pages/[date]/[slug]/+page.svelte` and `+page.ts` — permalink route.
- `pages/$types.d.ts` and `pages/[date]/[slug]/$types.d.ts` — `$types` stubs (not copied; see notes).
- `src/lib/Post.svelte` — reconfigured component, **re-typed in TS** (the example dropped TS). Keep only
  the `text` and `ai-graphic` block types (with `aiCharts = { AiMap }`); every other block type is added
  by the user when a post first uses it.
- `src/lib/post.ts` — **new** shared `PostStory` / `Block` types, imported by `Post.svelte` and
  `+layout.server.ts` (self-contained; avoids typing against `$locales` JSON that only exists post-transform).
- (No slugify template — it's a **base scaffold util** now; see prerequisite below.)
- `locales/en/content.json` + `locales/en/post-1.json` — **placeholder content stubs** matching the blog
  shape (main-page shell + one starter post). These ARE templated and copied so the app builds/runs even
  if Phase B fails. They're RNGS-owned once wired: `stories:sync` overwrites them with real content.

The mod runs in **two phases**: (A) deterministic local scaffolding via the transactional `applyPlan`
(rolls back on error), then (B) best-effort RNGS.io setup via the CLI (network; never rolls back A).

### Phase A — local scaffolding (transactional `FileOp`s via `templateCopyOp` + removes/writes)

1. Copy `pages/+layout.svelte`, `pages/+layout.server.ts`, `pages/+page.svelte`; **remove the base
   `pages/+layout.ts`** (its RNGS live-content universal load would shadow the server layout's `posts`).
2. Copy `pages/[date]/[slug]/+page.svelte` + `+page.ts` (new route).
3. Copy `src/lib/Post.svelte` and `src/lib/post.ts`; **remove `src/lib/App.svelte`**.
   3a. Copy placeholder `locales/en/content.json` + `locales/en/post-1.json` stubs (overwrite) so the app
   builds/runs before Phase B; `stories:sync` overwrites them later.
4. **Rewrite `rngs-io.json`**: set `storyboards.<storyboardId>.stories` to an empty object `{}` (a `write`
   op computed from the existing file — read, empty `stories`, write). **Keep the storyboard** — it groups
   the two stories we're about to create. This clears the stock page/embeds stories so `stories:sync`
   won't pull the old single-story content.
5. **Remove `pages/embeds/en/page/` and `locales/en/embeds.json`** (the single-page embed is meaningless
   in a blog and imports the now-removed `App.svelte`; `embeds.json`'s story is cleared from `rngs-io.json`
   in step 4, so it's orphaned). Keep `pages/embed-previewer/` and `make-ai-embed` working.
6. Dependencies via `ctx.pkg()` (first real use of the lazy `PackageJsonManager`): add `isbot`.
   (`slugify` is already a base dependency — see prerequisite.)
7. **Write the blog marker** `bin/mods/.converted-to-blog` (a `write` op) — marks this project as a blog so
   the mod is one-way and `project-type` can refuse to run afterward (see "One-way marker").

### Phase B — RNGS.io wiring (post-scaffold, best-effort)

`locales/` content is owned by RNGS.io: `stories:sync` re-downloads each story's JSON, overwriting local
content (including the Phase A stubs). The mod creates two RNGS stories from **stable template IDs** and
lets sync replace the stubs with real content. Put the IDs in a constant high in the mod:

```ts
// Stable RNGS.io story-template IDs for blog projects (update here if they ever change).
const RNGS_BLOG_TEMPLATES = {
  mainPage: 'cluzadqcr0000l808fq116bs1', // → locales/en/content.json
  post: 'cluzaet6l0001l808jqznav5v', // → locales/en/post-1.json
};
```

After Phase A succeeds, run (via `execSync`, using the storyboard kept in `rngs-io.json`):

1. `npx rngs-io stories new --syncPath "locales/en/content.json" --name "Main page" --template cluzadqcr0000l808fq116bs1`
2. `npx rngs-io stories new --syncPath "locales/en/post-1.json"   --name "Post 1"    --template cluzaet6l0001l808jqznav5v`
   — each CLI call creates the story and writes its entry back into `rngs-io.json`.
3. `pnpm stories:sync` — pulls the two stories, **overwriting `content.json`** (now the page shell) and
   **creating `post-1.json`** (the first post → first permalink page).

**Best-effort contract:** wrap Phase B so any failure (offline, auth, CLI error) does **not** roll back
Phase A. On failure, print the exact three commands for the user to run manually. Rationale: the local
scaffold is always valid to keep; only the network step is fallible, and it's fully reproducible by hand.

### One-way marker (blog is a one-way trip)

Add a tiny `_core/markers.ts` helper — `markerFile(root, name)` → `path.join(root, 'bin/mods', '.converted-to-<name>')`
and `hasMarker(root, name)`. `make-blog` writes the `blog` marker in Phase A (step 7).

- **`make-blog`** refuses (unless `--force`) if `hasMarker(root, 'blog')` — already converted.
- **`project-type`** gains a guard: refuse with a clear message if `hasMarker(root, 'blog')`, since a blog
  has no pages-plus/embed-only notion. (Small edit to `mods/project-type/index.ts`.)

The marker is committed project state (not gitignored) so the one-way status persists.

### Detection / guard

Primary guard is the marker above. Reuse the `--dry-run` / `--force` / `CancelledError` plumbing already in
the framework. In `--dry-run`, print the Phase B commands without executing them.

### Template-typecheck note

Unlike `project-type`/`make-ai-embed` templates (which typecheck in place because their content refs
match the repo), the blog templates assume a **post-transformation** project (reshaped `content.json`,
`post-1.json` present, `App.svelte` gone). Recommend **excluding
`bin/mods/mods/make-blog/templates/**`from`svelte-check`** (tsconfig `exclude`) and letting the TWD
build test validate them against a correctly transformed project, rather than contorting template code
with casts/stubs.

## Open questions — all resolved

1. ~~**RNGS.io wiring**~~ → Phase A empties `rngs-io.json` `stories` (keeps the storyboard); Phase B creates
   a "Main page" and "Post 1" story from stable template IDs, then `stories:sync` produces `content.json` +
   `post-1.json`. Best-effort with a manual fallback.
2. ~~**slugify**~~ → Add `src/utils/slugify` + the `slugify` dep to the **base scaffold** (a standing util);
   the mod just uses it via `$utils/slugify`. The library doesn't publicly export `slugify`, so we own it;
   identical impl keeps the permalink match.
3. ~~**embeds**~~ → Remove both `pages/embeds/en/page/` and `locales/en/embeds.json`; keep `embed-previewer`
   and `make-ai-embed`.
4. ~~**content.json rewrite vs transform**~~ → Neither — it comes from `stories:sync`, not the mod.
5. ~~**Reversibility**~~ → One-way, enforced by the `bin/mods/.converted-to-blog` marker (`make-blog` and
   `project-type` both refuse when present).

_Minor, decide at implementation:_ whether any `stories:*` package.json scripts need adjusting (e.g.
`stories:autolink --name`) or the defaults are fine.

## Verification

Phase B hits the network (RNGS + auth), so CI can't run it. Split the tests:

- **Phase A scaffolding test** (TWD, deterministic; skip/stub Phase B via an env flag or by testing the
  scaffolding function directly): run the mod, then assert `pages/[date]/[slug]/+page.ts` exists,
  `src/lib/App.svelte` + `pages/embeds/en/page/` + `locales/en/embeds.json` are gone, `src/lib/Post.svelte`
  - `src/lib/post.ts` + `bin/mods/.converted-to-blog` exist, `rngs-io.json` `stories` is `{}` (storyboard
    preserved), and the `isbot` dep was added. (Also assert the base scaffold now has `src/utils/slugify` and
    the `slugify` dep.)
- **One-way guard test:** after conversion, `changeProjectType(ctx)` refuses (marker present); and running
  `make-blog` again refuses without `--force`.
- **Build test** (TWD): no fixtures needed — the mod's placeholder `content.json` + `post-1.json` stubs
  make it buildable on their own. Run `vite build` and assert `dist/index.html` **and** the stub post's
  permalink `dist/2024-04-17/your-first-post/index.html` exist (proves the glob + crawler-link + prerender
  mechanism).
- `pnpm check` and `eslint` clean; `--dry-run` prints Phase A plan + Phase B commands, writes nothing,
  runs no CLI.
- Registry smoke test covers the new entry.
- **Manual/e2e** (once, by hand, with RNGS auth): run the full mod on a real scaffold and confirm the two
  stories are created and `stories:sync` produces the files.

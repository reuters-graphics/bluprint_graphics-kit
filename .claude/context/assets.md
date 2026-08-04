# Assets and media files

## Where files live

```
src/statics/          # Images, fonts, and other media used on the page
  images/
  fonts/
media-assets/         # Static files provided to media clients (JPG, PDF, EPS)
```

`src/statics/` files are served by the SvelteKit build and referenced in component code. `media-assets/` files are packaged separately for Reuters Connect clients and are not used in the page itself.

## Always use absolute paths

Never use relative paths to reference files in `src/statics/`. Always resolve them with the `asset` function from SvelteKit's `$app/paths`:

```svelte
<script>
  import { asset } from '$app/paths';
</script>

<img src={asset('/images/my-image.jpg')} alt="" />
```

This applies to asset paths in content blocks too — resolve `block.src` or similar fields with `asset`:

```svelte
<FeaturePhoto src={asset(`/${block.src}`)} />
```

### Local assets vs. external URLs

Not every `src`-like field points at a file in `src/statics/`. A `photo` or `video` block may instead carry a full URL to an externally hosted file (a CDN, a partner's server, etc.). `asset()` must never wrap an external URL — doing so mangles it into a broken local path.

Before wiring a field, check the actual value in `content.json`: a local path is relative (`images/photo.jpg`); an external URL is absolute or protocol-relative (`https://cdn.example.com/photo.jpg`, `//cdn.example.com/photo.jpg`).

A single block _type_ can carry either kind of value across different content instances — the CMS field doesn't restrict authors to one or the other. Don't assume a block type is "always local" or "always external" from one example; check every instance of that type in the doc.

Wire only for what you actually observe:

- Every instance local → one branch, wrapped in `asset()`.
- Every instance external → one branch, passed through unresolved.
- Both kinds observed among that type's instances → two branches, using `isExternalUrl()` from `$utils/propValidators` to tell them apart at runtime:

```svelte
<script>
  import { asset } from '$app/paths';
  import { isExternalUrl } from '$utils/propValidators';
</script>

{#if isExternalUrl(block.src)}
  <FeaturePhoto src={block.src} />
{:else}
  <FeaturePhoto src={asset(`/${block.src}`)} />
{/if}
```

Don't add the `isExternalUrl()` dual-branch defensively for a case that isn't present in the doc — a photo block with only local instances gets only the `asset()` branch, not a speculative external one "in case an editor pastes a URL later." If the content shape changes in rngs.io, re-run the wiring then.

### In component SCSS

Use inline styles to apply asset paths in component-scoped styles:

```svelte
<script>
  import { asset } from '$app/paths';
</script>

<div style="background-image: url({asset('/images/my-image.jpg')});"></div>
```

### In global SCSS

In `src/lib/styles/global.scss`, use a root-relative path — the kit resolves it to an absolute URL automatically:

```scss
@font-face {
  font-family: myCustomFont;
  src: url('/fonts/myFont.woff2') format('woff2');
}
```

## Optimising images

Images should be scaled to a web-friendly size before publishing. `pnpm savile` is an interactive CLI that guides users through resizing, optimising, or reformatting images — it requires human input and cannot be run autonomously. If you detect large image files in `src/statics/`, prompt the user to run `pnpm savile` themselves rather than running it on their behalf.

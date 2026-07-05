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

Never use relative paths to reference files in `src/statics/`. Always prefix with the `assets` variable from SvelteKit's `$app/paths`:

```svelte
<script>
  import { assets } from '$app/paths';
</script>

<img src="{assets}/images/my-image.jpg" alt="" />
```

This applies to asset paths in content blocks too — always prefix `block.src` or similar fields with `assets`:

```svelte
<FeaturePhoto src="{assets}/{block.src}" />
```

### In component SCSS

Use inline styles to apply asset paths in component-scoped styles:

```svelte
<script>
  import { assets } from '$app/paths';
</script>

<div style="background-image: url({assets}/images/my-image.jpg);"></div>
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

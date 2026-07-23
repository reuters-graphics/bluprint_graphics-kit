# Routing conventions

## Routes directory

This project uses `pages/` as its SvelteKit routes directory instead of SvelteKit's default `src/routes/`. This is configured in `svelte.config.js`. Everything else follows standard SvelteKit filesystem routing.

## Default structure

```
pages/
  +page.svelte              # Project homepage (reuters.com dotcom page)
  +layout.ts                # Shared layout
  embed-previewer/
    +page.svelte            # Dev-only page for previewing embeds in an iframe
  embeds/
    en/
      page/
        +page.svelte        # Embeddable version of the homepage for media clients
```

## Adding dotcom pages

New pages for reuters.com go at least one directory below the homepage:

```
pages/
  another-page/
    +page.svelte
```

Each additional page **must** include unique SEO metadata via the `SEO` component from `@reuters-graphics/graphics-components`, and ideally its own ArchieML content doc in `locales/`.

## Adding embeds

Embeddable graphics go in `pages/embeds/` and must follow a strict two-level structure: `pages/embeds/<language-code>/<slug>/+page.svelte`.

```
pages/
  embeds/
    en/
      map/
        +page.svelte        # Embeddable graphic at /embeds/en/map/
```

Embed pages **must** include the `EmbedMetadata` component from `@reuters-graphics/graphics-components` — use it _instead of_ the `SEO` component, which is meant for full, standalone pages. `EmbedMetadata` renders the metadata an embed needs (a canonical link, an `og:image` and a `noindex, nofollow, noarchive` robots tag to prevent search indexing) and mounts the `PymChild` component for you to enable iframe resizing by the parent page — so you don't add `PymChild` or the robots tag separately.

```svelte
<script lang="ts">
  import { EmbedMetadata } from '@reuters-graphics/graphics-components';
  import { page } from '$app/state';
  import { asset } from '$app/paths';
</script>

<EmbedMetadata
  baseUrl={__BASE_URL__}
  pageUrl={page.url}
  previewImgPath={asset('/images/my-embed-preview.jpg')}
  polling={500}
/>
```

## Media assets for clients

Static files for media clients (JPG, EPS) go in `media-assets/` using the **same language-code/slug structure** as embeds:

```
media-assets/
  en/
    map/
      map-preview.jpg
      map.eps
```

When a `media-assets/en/map/` directory shares a language/slug with a `pages/embeds/en/map/` page, the publisher bundles them together into a single archive on the Sphinx graphics server.

![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

[🏠 Docs](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/docs/developers/README.md) / **What's in it**


# Directory structure

```bash
locales/
media-assets/
pages/
src/
  lib/
  statics/
  utils/
  template.html
CLIENT_README.txt
google.json
svelte.config.js
```

### `locales/`

The locales directory includes language-specific data for your project. This is often where you'll download data from Google docs and sheets. Read more in the [metadata](./metadata.md) and [Google docs and sheets](./google-docs-and-sheets.md) docs.

You can import JSON files from this directory using the `$locales` alias. For example:

```svelte
<script>
  import enContent from '$locales/en/content';
</script>
```

### `media-assets/`

This directory is where you can put assets for media clients like EPS and JPG flat graphics. Read more about structuring media assets to upload to the graphics server in the [flats](./flats.md) docs.

### `pages/`

This directory allows you to define what pages and embeds will be published in your project. Read more in the [pages](./pages.md) docs.

### `src/`

This is the directory where you'll write most of your code.

#### `src/lib/`

Write Svelte components for your pages in this directory.

You can import components onto pages using the `$lib` alias. For example:

```svelte
<script>
  import MyComponent from '$lib/MyComponent/index.svelte';
</script>

<MyComponent />
```

Note: The `$lib` alias **does not work** in SCSS, so you'll still need to reference files using relative paths:

```svelte
<style lang="scss">
  @import "../styles.scss";
</style>
```

#### `src/statics/`

Put media assets like images, fonts and other data in this directory. Read more in the [media](./media.md) docs.

#### `src/utils/`

This directory contains a few utility functions. You can import modules from this directory using the `$utils` alias. For example:

```svelte
<script>
  import { getPath } from '$utils/statics';
</script>
```

#### `src/template.html`

This is the root file with basic markup for all pages and embeds created by the kit. In general, you shouldn't modify this file.

### `CLIENT_README.txt`

You should write specific instructions to clients using embeds from your project in this text file.

### `google.json`

This file configures Google docs and sheets connected to your project. Read more in [Google docs and sheets](./google-docs-and-sheets.md).

### `svelte.config.js`

The SvelteKit configuration file. In general, you shouldn't need to alter this file, but you can read more in the [SvelteKit docs](https://kit.svelte.dev/docs#configuration) if you do.

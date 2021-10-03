![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

[🏠 Docs](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/docs/developers/README.md) / **Working with media files**

# Working with media files

- [Where to put media files](#where-to-put-media-files)
- [How to use media files in your code](#how-to-use-media-files-in-your-code)

## Where to put media files

Put images, fonts and other static media files in dedicated folders in the statics directory at `src/statics/`.

```
src/
  statics/
    images/
      my-image.jpg 👈
    fonts/
      myfont.woff2 👈
```

## How to use media files in your code

When you reference media files, you should **always use absolute paths** (`https://graphics.reuters.com/.../my-file.jpg`), not relative paths (`./my-file.jpg`).

So to use media files in your code, you need to prefix the path to them.

You have two ways to do that:

#### `getPath`

Import our built-in `getPath` utility function and pass to it the path to your media file in the `src/statics/` directory.

For example, say you have an image like this:

```
src/
  statics/
    images/
      my-image.jpg
```

You'd use the `getPath` function like this:

```svelte
<script>
  import { getPath } from '$utils/statics';
</script>

<img alt="" src="{getPath('images/my-image.jpg')}" />
```

#### `assets`

You can also prefix the path yourself using SvelteKit's [built-in `assets` store](https://kit.svelte.dev/docs#modules-$app-paths):

```svelte
<script>
  import { assets } from '$app/paths';
</script>

<img alt="" src="{`${assets}/images/my-image.jpg`}" />
```

### Using media files in CSS

Use inline styles to set CSS styles with your media files.

```svelte
<script>
  import { getPath } from '$utils/statics';
</script>

<div
  style="{`background-image: url(${getPath('images/my-image.jpg')});`}"
></div>
```

... or ...

```svelte
<script>
  import { assets } from '$app/paths';
</script>

<div
  style="{`background-image: url(${`${assets}/images/my-image.jpg`});`}"
></div>
```

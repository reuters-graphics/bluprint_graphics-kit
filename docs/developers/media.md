![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

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

To use media files in your code, you need to prefix the path to them.

Import our built-in `getPath` utility and pass to it the path to your image in the `src/statics/` directory.

So say you have an image like this:

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

You can also prefix the path your self using SvelteKit's [built-in `assets` store](https://kit.svelte.dev/docs#modules-$app-paths):

```svelte
<script>
  import { assets } from '$app/paths';
</script>

<img alt="" src="{`${assets}/images/my-image.jpg`}" />
```

Use inline styles to set CSS styles with your media files.

```svelte
<div
  style="{`background-image: url(${getPath('images/my-image.jpg')});`}"
></div>
```

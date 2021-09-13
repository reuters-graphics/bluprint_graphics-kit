![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

[🏠 Docs](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/docs/developers/README.md) / **Translating pages**

# Translation

This kit does not include any built-in translation utilities like `gettext`. Instead, we recommend creating different [pages or embeds](./pages.md) for each language you're building and passing the translated content to common Svelte components.

Let's use a simple example.

Say you have translated content in your locales folder:

```bash
locales/
  en/
    content.json
  de/
    content.json
```

... with text like:

```javascript
// en/content.json
{
  "greeting": "Hello!"
}

// de/content.json
{
  "greeting": "Guten Tag!"
}
```

And let's say you wanted to publish a page and embed in both English 🇬🇧 and German 🇩🇪. You might have a `pages/` directory like:

```bash
pages/
  de/
    index.svelte 🇩🇪
  embeds/
    en/
      page.svelte 🇬🇧
    de/
      page.svelte 🇩🇪
  index.svelte 🇬🇧

```

Now each page can import the correct content for its translation and pass it to a common component:

```svelte
<!-- 🇬🇧 pages/index.svelte -->
<script>
  import content from '$locales/en/content.json';
  import MyPage from '$lib/MyPage/index.svelte';
</script>

<MyPage content="{content}" />
```

```svelte
<!-- 🇩🇪 pages/de/index.svelte -->
<script>
  import content from '$locales/de/content.json';
  import MyPage from '$lib/MyPage/index.svelte';
</script>

<MyPage content="{content}" />
```

And the common component `MyPage` can use the correct translated text passed to it:

```svelte
<!-- src/lib/MyPage/index.svelte -->
<script>
  export let content;
</script>

<h1>{content.greeting}</h1>
```

## Other options

For more complex handling, you can use something like [svelte-i18n](https://github.com/kaisermann/svelte-i18n).

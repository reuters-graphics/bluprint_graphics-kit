![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

[🏠 Docs](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/docs/developers/README.md) / **Making pages**

# Making pages

The graphics kit improves on our previous [graphics rig](https://github.com/reuters-graphics/bluprint_graphics-rig/) by letting you build _multiple_ pages and embeds so you can build full-fledged newsapps or projects with several graphics components that make sense as individual embeds for media clients.

## How to make pages

Public pages and embeds are both created in the `pages` directory. All pages are Svelte components. To create a new one, you'll add a new `.svelte` file in that directory.

```
pages/
  embeds/
    en/
      chart.svelte
      page.svelte
  index.svelte
```

### Public pages

Public pages can be named whatever you like. The filename and directory structure will be used to create the page path. For example, a directory like this:

```
pages/
  index.svelte
  second-page.svelte
  countries/
    usa.svelte
    uk.svelte
```

... would create pages like:

```
/index.html
/second-page/index.html
/countries/usa/index.html
/countries/uk/index.html
```

Pages can also be named using dynamic parameters that can create multiple pages.

```
pages/
  index.svelte
  countries/
    [code].svelte
```

Read more in [SvelteKit's docs](https://kit.svelte.dev/docs#routing-pages).

#### SEO

When you create public pages, you should always add SEO to them. Using our pre-built SEO component is the easiest way.

```svelte
<script>
  import { SEO } from '@reuters-graphics/graphics-svelte-components';
</script>

<SEO
  seoTitle="My SEO title"
  seoDescription="My SEO description"
  shareTitle="My share title"
  shareDescription="My share description"
  shareImgPath="images/reuters-graphics.jpg"
  lang="en"
/>
```

### Embeds

Embeds for clients are more restricted in how they should be organized.

Embeds must be added to the `pages/embeds/` directory under a folder named with a valid locale code -- e.g., `en`, `es`, `de`, etc. -- and can be no levels deeper than that.

```
pages/
  embeds/
    en/
      page.svelte
      chart.svelte
      map.svelte
    es/
      page.svelte
      map.svelte
```

Each of these will create a corresponding [edition](https://github.com/reuters-graphics/bluprint_graphics-kit/issues/1#issuecomment-811891029) in RNGS for clients:

```
media-en-page
media-en-chart
media-en-map
media-es-page
media-es-map
```

#### Pym

Always be sure to include Pym.js on embeddable pages. Using our pre-built component is the easiest way.

```svelte
<script>
  import { PymChild } from '@reuters-graphics/graphics-svelte-components';
</script>

<PymChild />
```

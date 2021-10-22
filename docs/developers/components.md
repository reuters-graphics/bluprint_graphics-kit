![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

[🏠 Docs](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/docs/developers/README.md) / **Building with components**

- [What's a component?](#whats-a-component)
- [Structuring your component's directory](#structuring-your-components-directory)

# Building with components

## What's a "component"?

If you've gone through any of the [Svelte tutorial](https://svelte.dev/tutorial/basics), you'll know pages in Svelte (and React, Vue and basically any modern JS framework) are made up of components.

Components can be as big or as little as you want then, but when you're just starting out, it's useful to think of components as just the _separable parts of your page_.

So, for example, a typical graphics page could be composed of the following components:
- Your headline
- Text paragraphs
- A map
- A chart

Some of those components may be used several times on your page -- for example, text -- while others are a once off -- your headline.

If you think about your page outlined in components, then, your page may look like this:

```svelte
<Headline />
<BodyText />
<Map />
<BodyText />
<Chart />
<BodyText />
```

## Structuring your component's directory

Once you know what components your page needs, it's a good idea to structure each component in folders within the `lib/` directory:

```bash
src/
  lib/
    components/
      Headline/
        index.svelte 👈
      BodyText/
        index.svelte 👈
      Chart/
        index.svelte 👈
      Map/
        index.svelte 👈
    Page.svelte
```

Now you can tie your components together in `Page.svelte`:

```svelte
<script>
  import Headline from './components/Headline/index.svelte';
  import BodyText from './components/BodyText/index.svelte';
  import Chart from './components/Chart/index.svelte';
  import Map from './components/Map/index.svelte';
</script>

<Headline />
<BodyText />
<Map />
<BodyText />
<Chart />
<BodyText />
```

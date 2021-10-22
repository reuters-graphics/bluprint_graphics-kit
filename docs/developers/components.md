![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

[🏠 Docs](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/docs/developers/README.md) / **Building with components**


# Building with components

- [What's a component?](#whats-a-component)
- [Structuring your component's directory](#structuring-your-components-directory)
- [Driving components with Google docs](#driving-components-with-google-docs)

## What's a "component"?

If you've gone through any of the [Svelte tutorial](https://svelte.dev/tutorial/basics), you'll know pages in Svelte (and React, Vue and basically any modern JS framework) are made up of components.

Components can be as big or as little as you want then, but when you're just starting out, it's useful to think of components as just the _separable parts of your page_.

So, for example, a typical graphics page could be composed of the following components:
- Your headline
- Text paragraphs
- A map
- A chart

Some of those components may be used several times on your page -- for example, text -- while others are a once-off -- your headline.

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

## Driving components with Google docs

In practice, we use Google docs to layout our pages and supply text to our components, so when tying together your components, you may want to make them part of the block structure pre-written in `Page.svelte`. For example:

```svelte
<script>
  // Content from your Google doc
  import content from '$locales/en/content.json';
  // Pre-made components
  
  import Headline from './components/Headline/index.svelte';
  import BodyText from './components/BodyText/index.svelte';
  import Chart from './components/Chart/index.svelte';
  import Map from './components/Map/index.svelte';
</script>

<Headline hed="{content.Hed}" />

{#each content.blocks as block}

  {#if block.Type === 'text'}
    <BodyText text="{block.Text}" />

  {:else if block.Type === 'chart'}
    <Chart title="{block.Title}" note="{block.Note}" />
  
  {:else if block.Type === 'map'}
    <Map title="{block.Title}" note="{block.Note}" />

  {:else}
    <div />
  {/if}
{/each}
```

This is a simplified example of how you can use components. Read on in these docs for more details on how to build up your graphics page.

![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

[🏠 Docs](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/docs/developers/README.md) / **Building with components**

# Building with components

- [What's a component?](#whats-a-component)
- [Structuring your component's directory](#structuring-your-components-directory)
- [Driving components with Google docs](#driving-components-with-google-docs)

## What's a "component"?

![](../../src/statics/images/docs-ai-ps/what-is.jpg 'Components are parts of a page')

If you've gone through any of the [Svelte tutorial](https://svelte.dev/tutorial/basics), you'll know pages in Svelte (and React, Vue and basically any modern JS framework) are made up of components.

While you _could_ write your page as a single, massive component, when you're just starting out, it's useful to think of components as the _separable parts of your page_.

So, for example, a typical graphics page could be composed of the following components:

- Your headline
- Text paragraphs
- A map
- A chart

Some of those components may be used several times on your page (text) while others are a once-off (headline).

If you think about your page outlined in components, then, your page may look like this:

```bash
+ Headline
+ BodyText
+ Map
+ BodyText
+ Chart
+ BodyText
```

## Why components?

![](../../src/statics/images/docs-ai-ps/reusability.jpg 'Reusability of code')

## Props

At it's core, reusability of a component is driven by these things called "props", which can be really powerful once we learn how to think about them. Let's dive in.

What if I told you you've already been using props without calling them that?

Remember that text component we talked about above? "My name is Adam" and "I like oranges" were just that! Props!

![](../../src/statics/images/docs-ai-ps/props.jpg 'Props')

![](../../src/statics/images/docs-ai-ps/multiple-props.jpg 'Multiple props')

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

Now you can tie your components together in `Page.svelte` to follow your outline:

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

## Writing a Svelte component

In the spirit of dividing your page into "parts" called components, svelte goes a step further.
Svelte components not only have all the component's html in one separate file, but also the JS and SCSS associated with the component.
Those styles can be local: specifc to that component _only_, as well as applied globally.

![](../../src/statics/images/docs-ai-ps/structure-of-a-component.jpg 'Structure of a svelte component')

## Driving components with Google docs

In practice, we usually use Google docs to outline and layout our pages and to supply the text to our components. So when tying together your components, you may want to make them part of the block structure pre-written in `Page.svelte`. For example:

```svelte
<script>
  // Content from your Google doc
  import content from '$locales/en/content.json';

  // Your components
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
    <div></div>
  {/if}
{/each}
```

This is a simplified example of how you can use components. Read on in these docs for more details on how to build up your graphics page.

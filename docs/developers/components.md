![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

[🏠 Docs](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/docs/developers/README.md) / **Building with components**

# Building with components

- [What's a component?](#whats-a-component)
- [Parts of a Svelte component](#parts-of-a-svelte-component)
- [Props](#props)
- [Structuring your component's directory](#structuring-your-components-directory)
- [Driving components with Google docs](#driving-components-with-google-docs)

## Watch 🎥

> **Tip**: This video is a complete intro to writing Svelte in our new graphics kit from the ground up by writing a simple before & after image slider. It's a longer video, but if you're coming in fresh to Svelte and the concept of components, it's a good spot to start.
>
> That said, you'll follow along easier if you've checked out at least the first couple sections of the official [official Svelte tutorial](https://svelte.dev/tutorial/basics).

[![YouTube video](https://img.youtube.com/vi/VTtDTiuY2w4/0.jpg)](https://www.youtube.com/watch?v=VTtDTiuY2w4)

## What's a "component"?

![](https://user-images.githubusercontent.com/12295494/140011259-9aab7e74-151d-4e99-88d5-b2b30c8ade4b.jpg 'Components are parts of a page')

If you've gone through any of the [Svelte tutorial](https://svelte.dev/tutorial/basics), you'll know pages in Svelte (and React, Vue and basically any modern JS framework) are made up of **components**.

While you _could_ write your page as a single, massive component, when you're just starting out, it's useful to think of components as the _separable parts of your page_.

So, for example, a typical graphics page could be composed of the following components:

- Your headline
- A photo
- Some text
- A graphic
- Some referrals

Some of those components may be used several times on your page (text) while others are a once-off (headline).

If you think about your page outlined in components, then, your page may look like this:

```bash
+ Headline
+ BodyText
+ Photo
+ BodyText
+ Chart
+ BodyText
+ Referrals
```

## Parts of a Svelte component

Svelte components include not only have all the component's html but also any JS and SCSS needed for the component all in a single file. This structure makes it easy to work on parts of your page in isolation and encourage strong organization in your project.

![](https://user-images.githubusercontent.com/12295494/140011258-66cfc5c2-d2d2-4318-b84b-352b8c7b806d.jpg 'Structure of a svelte component')


## Props

At it's core, reusability of a component is driven by these things called "props", which can be really powerful once we learn how to think about them. Let's dive in.

What if I told you you've already been using props without calling them that?

First, let me start with some jargon.

![](https://user-images.githubusercontent.com/12295494/140307702-f5f8d06d-1beb-48ff-b547-167425b197db.jpg 'Jargon')

![](https://user-images.githubusercontent.com/12295494/140307683-74727a36-b8e2-45d9-b204-9e42d179f876.jpg 'JS in HTML')

Now, to explain what props are:

![](https://user-images.githubusercontent.com/12295494/140307709-3e9c0b53-cac6-4568-92a8-03e71701f02c.jpg 'Props')

## Structuring your component's directory

Once you know what components your page needs, it's a good idea to structure each component within the `lib/` directory:

```bash
src/
  lib/
    components/
      Headline.svelte 👈
      BodyText.svelte 👈
      Chart/
        barchart.js   👈
        index.svelte  👈
      Map.svelte      👈
    Page.svelte
```

Now you can tie your components together in `Page.svelte` to follow your outline:

```svelte
<script>
  import Headline from './components/Headline.svelte';
  import BodyText from './components/BodyText.svelte';
  import Chart from './components/Chart/index.svelte';
  import Map from './components/Map.svelte';
</script>

<Headline />
<BodyText />
<Map />
<BodyText />
<Chart />
<BodyText />
```


## Driving components with Google docs

In practice, we usually use Google docs to outline and layout our pages and to supply the text to our components. So when tying together your components, you may want to make them part of the block structure pre-written in `Page.svelte`. For example:

```svelte
<script>
  // Content from your Google doc
  import content from '$locales/en/content.json';

  // Your components
  import Headline from './components/Headline.svelte';
  import BodyText from './components/BodyText.svelte';
  import Chart from './components/Chart/index.svelte';
  import Map from './components/Map.svelte';
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

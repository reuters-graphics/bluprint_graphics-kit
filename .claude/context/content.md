# Editable content for graphics pages

Editable content for graphics pages is usually written in our CMS, rngs.io, where it can be worked on with other editors and reporters in our newsroom.

We also use rngs.io to control the order of content on the page.

The content is serialised to JSON, usually in `locales/en/content.json`. If the content file comes from rngs.io (most often the case), it has a shape like:

```json
{
  "metadata": {
    // Metadata about the rngs.io doc
  },
  "story": {
    // Content written in rngs.io
  }
}
```

**IMPORTANT:** Never edit `locales/en/content.json` unless specifically instructed to do so by a user. Any changes made locally will simply be overwritten the next time the file is synced with its upstream source in rngs.io. Instead, you should suggest edits to the content in rngs.io using ArchieML syntax.

## Using content in graphics pages

The `story` property from the content JSON file is usually passed directly to the `content` prop of `src/lib/App.svelte`.

Stand-alone data values may be at the top-level of the `story` object. Ordered content is usually contained in a `blocks` array inside the `story` object:

```json
{
  // ...
  "story": {
    // Stand-alone values
    "hed": "My page headline",
    // Ordered content blocks
    "blocks": [
      {
        "type": "text",
        "text": "Lorem ipsum..."
      }
      // Additional content blocks...
    ]
  }
}
```

### Pairing components to content to build a graphics page

Components from the `@reuters-graphics/graphics-components` library are often added to the `#each` loop in `src/lib/App.svelte` that loops over the `content.blocks`.

`content` represents text content pulled from our CMS as JSON that is passed into components via props.

Each block in `content.blocks` (i.e., "content block") is usually an object with a `type` property, which specifies the kind of component that block belongs to, and additional properties specific to the block type. For example:

- **Text Block**:
  ```json
  {
    "type": "text",
    "text": "This is a text block."
  }
  ```
- **AI Graphic Block**
  ```json
  {
    "type": "ai-graphic",
    "chart": "AiMap",
    "width": "normal",
    "textWidth": "normal",
    "title": "Optional title of the graphic",
    "description": "Optional chatter describes more about the graphic.",
    "notes": "Note: Optional note clarifying something in the data.\r\n\r\nSource: Optional source of the data.",
    "altText": "Add a description of the graphic for screen readers. This is invisible on the page."
  }
  ```

To add a new component to the loop:

1. Import the component in the script portion of the Svelte component, if it isn't imported already.
2. Add a new `else if` condition in the `{#each content.blocks as block}` loop to handle the new block type.
3. Pass the required props to the component, ensuring they match the structure of the content block object.

For example, to add a new FeaturePhoto:

```svelte
<script lang="ts">
  // ...

  import { assets } from '$app/paths';

  import {
    Article,
    Analytics,
    BodyText,
    EndNotes,
    SiteHeadline,
    GraphicBlock,
    InlineAd,
    FeaturePhoto, // Add the component to others already imported
  } from '@reuters-graphics/graphics-components';

  // ...
</script>

{#each content.blocks as block}
  <!-- Text block -->
  {#if block.type === 'text'}
    <BodyText text={block.text} />

    <!-- Other block types -->

    <!-- Add new FeaturePhoto block -->
  {:else if block.type === 'feature-photo'}
    <FeaturePhoto
      src="{assets}/{block.src}"
      alt={block.alt}
      caption={block.caption}
      credit={block.credit}
    />
  {:else}
    <LogBlock message={`Unknown block type: "${block.type}"`} />
  {/if}
{/each}
```

## ArchieML

While editable content is downloaded as JSON in the project, that data is written into our CMS, rngs.io, using ArchieML syntax.

**When suggesting what content blocks to add or edit for components, please also suggest how to write that content in rngs.io using ArchieML.**

Read about ArchieML syntax in `.claude/llms/archieml/docs.md`.

### ArchieML conventions in our CMS

Usually, content blocks are written in our CMS as objects inside an ArchieML array called `blocks` and always start with a `type:` key/value pair that defines the type of the content block object.

For example, a user adding a content block for a FeaturePhoto component, might add the following to the existing `[blocks]` array in our CMS:

```
[blocks]

type: feature-photo
src: images/myPhoto.jpg
alt: Alt text for my photo...

... which extends over multiple lines.
:end
caption: A photo of something interesting.
credit: Jane Doe

[]
```

<script>
  // Reuters Graphics components lib (see below)
  import {
    Article,
    BodyText,
    NoteText,
    Headline,
    GraphicBlock,
  } from '@reuters-graphics/graphics-components';

  // Content from your Google doc
  import content from '$locales/en/content.json';

  // Import components you make here, incuding ai2svelte components.
  // "$lib" below is shortcut for the src/lib/ directory
  import MyMap from '$lib/ai2svelte/ai-chart.svelte';

  // Other dependencies
  import { apdate } from 'journalize';
  import { marked } from 'marked';
  import { assets } from '$app/paths';

  export let embedded = false;
</script>

<Article>
  <!--
    This Headline and other components are part of our components library.
    📚 Read the docs: https://reuters-graphics.github.io/graphics-components/
  -->
  <Headline section="{content.Kicker}" hed="{content.Hed}" dek="{content.Dek}">
    <span slot="byline">By {@html marked.parseInline(content.Byline)} </span>
    <div slot="dateline">
      Published <time datetime="{content.Published}">
        {apdate(new Date(content.Published))}</time
      >
      {#if content.Updated}
        <br /> Updated
        <time datetime="{content.Updated}">
          {apdate(new Date(content.Updated))}
        </time>
      {/if}
    </div>
  </Headline>

  <!-- 🔁 Looping through your Google doc blocks... -->
  {#each content.blocks as block}
    <!-- Text block -->
    {#if block.Type === 'text'}
      <BodyText text="{block.Text}" />

      <!-- Ai2svelte graphic block -->
    {:else if block.Type === 'ai2svelte-map'}
      <GraphicBlock
        id="{block.Type}"
        width="{block.Size}"
        title="{block.Title}"
        description="{block.Chatter}"
        notes="{`Note: ${block.Note}\n\nSource: ${block.Source}`}"
        ariaDescription="{block.AltText}"
      >
        <MyMap assetsPath="{assets}" />
      </GraphicBlock>
    {:else}
      {(console.warn(`Unknown block type: ${block.Type}`), '')}
    {/if}
  {/each}

  <NoteText text="{content.EndNotes}" />
</Article>

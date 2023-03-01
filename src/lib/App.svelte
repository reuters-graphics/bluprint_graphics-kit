<script>
  export let embedded = false;
  // Graphics components
  import {
    Article,
    BodyText,
    NoteText,
    Headline,
    GraphicBlock,
    Scroller,
    getScrollerPropsFromDoc as scrollerProps,
  } from '@reuters-graphics/graphics-components';

  // Other dependencies
  import { apdate } from 'journalize';
  import { marked } from 'marked';
  import { assets } from '$app/paths';

  export let content; // Google doc content
  export let locale = 'en'; // Defaults to English

  // Import ai2svelte components...
  import MyMap from '$lib/ai2svelte/ai-chart.svelte';

  // ...and add them to this object.
  const aiCharts = {
    MyMap,
  };
</script>

<Article>
  <!--
    This Headline and other components are part of our components library.
    📚 Read the docs: https://reuters-graphics.github.io/graphics-components/
  -->
  <Headline section="{content.Kicker}" hed="{content.Hed}" dek="{content.Dek}">
    <span slot="byline">{@html marked.parseInline(content.Byline)} </span>
    <div slot="dateline">
      {content.Published}
      <time datetime="{content.PublishedDate}">
        {apdate(new Date(content.PublishedDate))}</time
      >
      {#if content.UpdatedDate}
        <br />
        {content.Updated}
        <time datetime="{content.UpdatedDate}">
          {apdate(new Date(content.UpdatedDate))}
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
    {:else if block.Type === 'ai-graphic'}
      {#if !aiCharts[block.Chart]}
        {(console.warn(`Unable to find "${block.Chart}" in aiCharts.`), '')}
      {:else}
        <GraphicBlock
          id="{block.Type}"
          width="{block.Width}"
          title="{block.Title}"
          description="{block.Chatter}"
          notes="{block.Notes}"
          ariaDescription="{block.AltText}"
        >
          <svelte:component
            this="{aiCharts[block.Chart]}"
            assetsPath="{assets || '/'}"
          />
        </GraphicBlock>
      {/if}

      <!-- Ai2svelte scroller -->
    {:else if block.Type === 'ai-scroller'}
      <Scroller
        {...scrollerProps(block, aiCharts, assets || '/')}
        embedded="{embedded}"
      />
    {:else}
      {(console.warn(`Unknown block type: ${block.Type}`), '')}
    {/if}
  {/each}

  <NoteText text="{content.EndNotes}" />
</Article>

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

  // Google doc content
  import content from '$locales/en/content.json';

  // Other dependencies
  import { apdate } from 'journalize';
  import { marked } from 'marked';
  import { assets } from '$app/paths';

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
    {:else if block.Type === 'ai-graphic'}
      {#if !aiCharts[block.Chart]}
        {(console.warn(`Unable to find "${block.Type}" in aiCharts.`), '')}
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

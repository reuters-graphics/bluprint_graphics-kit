<script>
  export let embedded = false;

  import { assets } from '$app/paths';
  import {
    Article,
    BodyText,
    EndNotes,
    Headline,
    GraphicBlock,
    Scroller,
    getScrollerPropsFromDoc as scrollerProps,
    getEndNotesPropsFromDoc as endNotesProps,
  } from '@reuters-graphics/graphics-components';

  export let content; // Google doc content

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
  <Headline
    section="{content.Kicker}"
    hed="{content.Hed}"
    dek="{content.Dek}"
    authors="{content.Authors}"
    publishTime="{content.PublishedDate}"
    updateTime="{content.UpdatedDate}"
  />

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
      <Scroller {...scrollerProps(block, aiCharts, assets || '/')} {embedded} />
    {:else}
      {(console.warn(`Unknown block type: "${block.Type}"`), '')}
    {/if}
  {/each}

  <EndNotes notes="{endNotesProps(content.EndNotes)}" />
</Article>

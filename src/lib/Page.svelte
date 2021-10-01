<script>
  // Content from your Google doc
  import content from '$locales/en/content.json';

  // Reuters Graphics components lib (see below)
  import {
    BodyText,
    Image,
    EndNotes,
    Headline,
  } from '@reuters-graphics/graphics-svelte-components';

  // Pre-built wrapper components for Ai2svelte graphics
  import AiGraphicWrapper from './ai2html/AiGraphicWrapper/index.svelte';
  import AiScrollerWrapper from './ai2html/AiScrollerWrapper/index.svelte';

  // Other dependencies
  import { apdate } from 'journalize';
  import marked from 'marked';

  // A custom component written for this project
  import Chart from './Chart.svelte';
</script>

<article class="container-fluid">
  <!--
    This Headline and other components are part of our components library.
    📚 Read the docs: https://reuters-graphics.github.io/graphics-svelte-components/
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

  <!-- Looping through your Google doc blocks... -->
  {#each content.blocks as block}
    <!-- Text block -->
    {#if block.Type === 'text'}
      <BodyText text="{block.Text}" />

      <!-- Photo block -->
    {:else if block.Type === 'photo'}
      <Image
        src="{block.Src}"
        caption="{block.Caption}"
        alt="{block.AltText}"
        wider
      />

      <!-- Graphic block -->
    {:else if block.Type === 'graphic'}
      <Chart
        title="{block.Title}"
        id="{block.ID}"
        chatter="{block.Chatter}"
        source="{block.Source}"
        note="{block.Note}"
        size="{block.Size}"
      />

      <!-- Ai2svelte block -->
    {:else if block.Type === 'ai2svelte'}
      <AiGraphicWrapper
        componentName="{block.ComponentName}"
        id="{block.ComponentName}"
        size="{block.Size}"
      >
        <div slot="title" class="title">
          {#if block.Title}<h4>{block.Title}</h4>{/if}
          {#if block.Chatter}<p>{block.Chatter}</p>{/if}
        </div>
        <aside slot="notes">
          {#if block.Note}<p class="note">Note: {block.Note}</p>{/if}
          {#if block.Source}<p class="source">Source: {block.Source}</p>{/if}
        </aside>
      </AiGraphicWrapper>

      <!-- Scroller block -->
    {:else if block.Type === 'ai-scroller'}
      <AiScrollerWrapper
        id="{block.ID}"
        steps="{block.steps}"
        graphicSize="{block.GraphicSize}"
        textPosition="{block.TextPosition}"
      />

      <!-- ?? -->
    {:else}
      {console.warn(`Unknown block type: ${block.Type}`)}
    {/if}
  {/each}

  <EndNotes text="{content.EndNotes}" />
</article>

<style lang="scss">
</style>

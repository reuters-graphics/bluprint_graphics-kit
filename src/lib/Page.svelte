<script>
  import content from '$locales/en/content.json';
  import { apdate } from 'journalize';
  import marked from 'marked';
  import {
    BodyText,
    Image,
    EndNotes,
    Headline,
  } from '@reuters-graphics/graphics-svelte-components';

  // Other pre-written components you can use
  import Chart from './Chart.svelte';
  import Ai2svelteScroller from './ai2html/Scroller/index.svelte';
  import Ai2svelte from './ai2html/AiContainer/index.svelte';

  /* Note: You can also directly import the ai2svelte component instead
  of pulling it from the google doc, like this:
  
  import Aifile from './ai2html/ai-chart.svelte';
        <Ai2svelte
        componentName="{block.ComponentName}"
        component="{Aifile}" // ADD YOUR MANUALLY IMPORTED COMPONENT HERE
        id="{block.ComponentName}"
        size="{block.Size}"
      >
*/
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

  <!-- Looping through you Gdoc blocks... -->
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

      <!-- Ai2svelte block -->
    {:else if block.Type === 'ai2svelte'}
      <Ai2svelte
        componentName="{block.ComponentName}"
        id="{block.ComponentName}"
        size="{block.Size}"
      >
        <!-- If you don't need title or notes, you can delete the lines below -->
        <div slot="title" class="title">
          <h4>{block.Title}</h4>
          <p>{block.Chatter}</p>
        </div>
        <aside slot="notes">
          <p class="note">Note: {block.Note}</p>
          <p class="source">Source: {block.Source}</p>
        </aside>
      </Ai2svelte>

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

      <!-- Scroller block -->
    {:else if block.Type === 'scroller'}
      <Ai2svelteScroller
        id="{block.ID}"
        blurbs="{block.blurbs}"
        graphicSize="{block.GraphicSize}"
        blurbPosition="{block.BlurbPosition}"
      />
    {/if}
  {/each}

  <EndNotes text="{content.EndNotes}" />
</article>

<style lang="scss">
</style>

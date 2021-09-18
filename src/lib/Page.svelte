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
  import Chart from './Chart.svelte';
  console.log(content);
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

      <!-- Graphic block -->
    {:else if block.Type === 'graphic'}
      <Chart
        title="{block.Title}"
        chatter="{block.Chatter}"
        source="{block.Source}"
        note="{block.Note}"
        size="{block.Size}"
      />
    {/if}
  {/each}

  <EndNotes text="{content.EndNotes}" />
</article>

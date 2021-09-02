<script>
  import content from '$locales/en/content.json';
  import {
    BodyText,
    Image,
    EndNotes,
    Headline,
  } from '@reuters-graphics/graphics-svelte-components';
  import Chart from './Chart.svelte';
  import BasicBarchart from './BasicBarchart.svelte';
  import StackedBarchar from './StackedBarchart.svelte';
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  onMount(() => {
    d3.selectAll('a').attr('target', '_blank');
  });
</script>

<article class="container-fluid">
  <!--  Read the docs: https://reuters-graphics.github.io/graphics-svelte-components/ -->
  <Headline section="{content.Kicker}" hed="{content.Hed}" dek="{content.Dek}">
    <span slot="byline">By {@html content.Byline} </span>
    <span slot="dateline">Published Jan. 1, 2021</span>
  </Headline>

  <!-- Looping through you Gdoc blocks... -->
  {#each content.blocks as block}
    {#if block.Type === 'text'}
      <BodyText text="{block.Text}" />
    {:else if block.Type === 'photo'}
      <Image
        src="images/shark.jpg"
        caption="{block.Caption}"
        alt="{block.AltText}"
        wide
      />
    {:else if block.Type === 'graphic'}
      <Chart
        title="{block.Title}"
        chatter="{block.Chatter}"
        source="{block.Source}"
        note="{block.Note}"
        size="{block.Size}"
      />
    {:else if block.Type === 'graphic-barchart'}
      <BasicBarchart
        title="{block.Title}"
        chatter="{block.Chatter}"
        source="{block.Source}"
        note="{block.Note}"
        size="{block.Size}"
      />
    {:else if block.Type === 'graphic-stacked-barchart'}
      <StackedBarchar
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

<style lang="scss">
  :global(aside p) {
    margin-bottom: 0 !important;
  }
</style>

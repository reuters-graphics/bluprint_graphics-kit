<script>
  import content from '$locales/en/content.json';
  import { apdate } from 'journalize';

  import {
    BodyText,
    Image,
    EndNotes,
    Headline,
  } from '@reuters-graphics/graphics-svelte-components';
  import Chart from './Chart.svelte';

  /* Use these lines if you want to use d3 to make all links open in new tabs
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  onMount(() => {
    d3.selectAll('a').attr('target', '_blank');
  }); */
</script>

<article class="container-fluid">
  <!--  Read the docs: https://reuters-graphics.github.io/graphics-svelte-components/ -->
  <Headline section="{content.Kicker}" hed="{content.Hed}" dek="{content.Dek}">
    <span slot="byline">By {@html content.Byline} </span>
    <span slot="dateline">
      Published <time datetime="{content.Published}">
        {apdate(new Date(content.Published))}</time
      >
    </span>
    <!-- Add new slot for Updated dateline? -->
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
    {/if}
  {/each}

  <EndNotes text="{content.EndNotes}" />
</article>

<style lang="scss">
  :global(aside p) {
    margin-bottom: 0 !important;
  }
</style>

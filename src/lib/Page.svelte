<script>
  import content from '$locales/en/content.json';
  import {
    BodyText,
    Image,
    EndNotes,
    Headline,
  } from '@reuters-graphics/graphics-svelte-components';
  import Chart from './Chart.svelte';
</script>

<article class="container-fluid">
  <!--  Read the docs: https://reuters-graphics.github.io/graphics-svelte-components/ -->
  <Headline section="{content.Kicker}" hed="{content.Hed}" dek="{content.Dek}">
    <span slot="byline"
      >By <strong>Jane Doe</strong> & <strong>John Doe</strong></span
    >
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
      <Chart title="{block.Title}" chatter="{block.Chatter}" />
    {/if}
  {/each}

  <EndNotes text="{content.EndNotes}" />
</article>

<script>
  import Chart from '$lib/Chart.svelte';
  import { PymChild } from '@reuters-graphics/graphics-svelte-components';
  import content from '$locales/en/content.json';
</script>

<article>
  {#each content.blocks as block}
    {#if block.Type === 'graphic'}
      <Chart
        title="{block.Title}"
        chatter="{block.Chatter}"
        source="{block.Source}"
        note="{block.Note}"
        size="{block.Size}"
      />
    {/if}
  {/each}
</article>
<PymChild />

<!-- svelte-ignore css-unused-selector -->
<style lang="scss">
  @import '~@reuters-graphics/style-main/scss/fonts/font-faces';
  :global {
    @import '@reuters-graphics/style-theme-eisbaer/scss/main';
  }
</style>

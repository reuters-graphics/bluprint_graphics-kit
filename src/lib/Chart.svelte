<script>
  import Chart from '@reuters-graphics/categorical-bar-chart';
  import { onMount } from 'svelte';
  import debounce from 'lodash-es/debounce.js';
  export let title;
  export let chatter;
  export let source;
  export let note;
  export let size;

  onMount(() => {
    const chart = new Chart();
    chart.selection('#basic-barchart').draw();

    const resize = debounce(() => {
      chart.draw();
    }, 250);
    window.addEventListener('resize', resize);
  });
</script>

<section class="graphic borderless {size} borderless py-5">
  <h3>{title}</h3>
  <p>{chatter}</p>
  <div id="basic-barchart" class="barchart-container"></div>
  <aside>
    <p class="note mt-3">
      Note: {@html note}
    </p>
    <p class="source">Source: {@html source}</p>
  </aside>
</section>

<style lang="scss">
  :global {
    $barChart-container: '.barchart-container';
    @import '~@reuters-graphics/categorical-bar-chart/src/scss/chart';
  }
</style>

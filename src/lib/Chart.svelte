<script>
  import Chart from '@reuters-graphics/categorical-bar-chart';
  import { onMount, onDestroy } from 'svelte';
  import debounce from 'lodash-es/debounce.js';
  import marked from 'marked';

  export let title;
  export let chatter;
  export let source;
  export let note;
  export let size;

  const chart = new Chart();

  const resize = debounce(() => {
    chart.draw();
  }, 250);

  onMount(() => {
    chart.selection('#basic-barchart').draw();
    window.addEventListener('resize', resize);
  });
  onDestroy(() => {
    window.removeEventListener('resize', resize);
  });
</script>

<section class="graphic {size}">
  <h3>{title}</h3>
  <p>{chatter}</p>
  <div id="basic-barchart" class="barchart-container"></div>
  <aside>
    <p class="note">
      Note: {marked.parseInline(note)}
    </p>
    <p class="source">Source: {marked.parseInline(source)}</p>
  </aside>
</section>

<style lang="scss">
  :global {
    $barChart-container: '.barchart-container';
    @import '~@reuters-graphics/categorical-bar-chart/src/scss/chart';
  }
</style>

<script>
  import BarChart from '@reuters-graphics/categorical-bar-chart';
  import { onMount } from 'svelte';
  import debounce from 'lodash-es/debounce.js';
  import marked from 'marked';

  export let title;
  export let id;
  export let chatter;
  export let source;
  export let note;
  export let size;

  const chart = new BarChart();

  const resize = debounce(() => {
    chart.draw();
  }, 250);

  onMount(() => {
    chart.selection(`#${id}`).draw();
    window.addEventListener('resize', resize);
  });
</script>

<section class="graphic {size}">
  <h3>{title}</h3>
  <p>{chatter}</p>
  <div id="{id}" class="barchart-container"></div>
  <aside>
    <p class="note">
      Note: {@html marked.parseInline(note)}
    </p>
    <p class="source">Source: {@html marked.parseInline(source)}</p>
  </aside>
</section>

<!-- svelte-ignore css-unused-selector -->
<style lang="scss">
  :global {
    $barChart-container: '.barchart-container';
    @import '~@reuters-graphics/categorical-bar-chart/src/scss/chart';
  }
</style>

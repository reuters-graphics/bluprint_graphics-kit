<script>
  import Chart from './Chart';
  import { onMount } from 'svelte';

  let chartContainer;

  const chart = new Chart();
  const resize = () => chart.draw();

  onMount(() => {
    chart.selection(chartContainer).draw();

    if (window) window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  });
</script>

<section class="graphic">
  <div id="chart" bind:this="{chartContainer}"></div>
</section>

<style lang="scss">
  #chart {
    width: 100%;
    :global {
      circle {
        stroke: #333;
        stroke-width: 1px;
      }
    }
  }
</style>

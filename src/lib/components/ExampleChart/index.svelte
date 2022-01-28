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
      @import '~@reuters-graphics/style-main/scss/fonts/mixins';

      circle {
        stroke: #777;
        stroke-width: 1px;
      }

      path.domain,
      .axis line {
        stroke: #999;
      }

      .axis {
        text {
          font-size: 0.875rem;
          font-family: $font-family-sans-serif;
        }
      }
    }
  }
</style>

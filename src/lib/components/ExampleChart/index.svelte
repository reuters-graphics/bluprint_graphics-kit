<script>
  import Chart from './Chart';
  import { onMount } from 'svelte';
  import { GraphicBlock } from '@reuters-graphics/graphics-components';

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

<GraphicBlock width="normal">
  <div class="w-full" id="chart" bind:this="{chartContainer}"></div>
</GraphicBlock>

<style lang="scss">
  @import '@reuters-graphics/graphics-components/dist/scss/mixins';

  #chart {
    :global {
      circle {
        stroke: var(--grey-500);
        stroke-width: 1px;
      }

      path.domain,
      .axis line {
        stroke: var(--grey-300);
      }

      .axis {
        text {
          @include text-xxs;
          fill: var(--grey-500);
          @include font-sans;
        }
      }
    }
  }
</style>

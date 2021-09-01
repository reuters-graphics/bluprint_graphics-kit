<script>
  import Chart from '@reuters-graphics/categorical-bar-chart';
  import { onMount } from 'svelte';
  import debounce from 'lodash-es/debounce.js';
  import dummyData from '@reuters-graphics/categorical-bar-chart/src/js/dummyData/stackedBarData.json';

  export let title;
  export let chatter;
  export let source;
  export let note;
  export let size;

  let stackedBarchartProps = {
    // Props for retrieving the right column names
    getValue: (d) => d['cumulative-child-cases'],
    getCategory: (d) => d.Date,
    getStackedBgValue: (d) => d['cumulative-total-cases-all-ages'], // null, or d => d.colName

    // Props for chart type/orientation
    stacked: true,
    verticalChart: true,
    sortAscending: false,

    // Props for dealing with dates
    dateAxis: true,
    dateFormat: {
      input: '%-m/%-d/%y', // how is the date in the data formatted?
      output: '%b. %e', // how do you want to format the date labels on the chart axis?
      outputWithYear: "%b. %e, '%y", // Optional; if you want the year to appear on some ticks, or otherwise customise how some ticks show up
      datesWithYear: ['4/16/20', '4/15/21'], // Optiona; array of dates you want to apply the special 'outputWithYear' option to
      tickFormat: null, // Optional; you can write your own tickFormat function
      tickValues: ['4/16/20', '8/13/20', '12/10/20', '4/15/21', '8/12/21'], // The dates that will show up on the axis
    },

    // Optional props for customising the x-axis
    valueScale: { domain: [0, 31000000] },
    valueAxis: {
      tickFormat: (d, i) => {
        return d / 1000000;
      },
      annotation: {
        text: 'million cases',
        dx: -22,
        dy: 31,
        textAnchor: 'start',
      },
    },
    // Show category labels. See the list of all props to see how you can customise these labels
    categoryLabel: {
      show: true,
    },

    // Other optional props that were used in this chart
    aspectRatio: 0.6,
    margin: { left: 90, right: 60 },
    bgfill: '#d2e6f3',
    barLabel: { show: false },
    padding: 0,
  };

  onMount(() => {
    const chart = new Chart();
    chart
      .selection('#stacked-barchart-vert')
      .data(dummyData)
      .props(stackedBarchartProps)
      .draw();

    const resize = debounce(() => {
      chart.draw();
    }, 250);
    window.addEventListener('resize', resize);
  });
</script>

<section class="graphic {size} borderless py-5">
  <h3>{title}</h3>
  <p>{@html chatter}</p>
  <div id="stacked-barchart-vert" class="barchart-container"></div>
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

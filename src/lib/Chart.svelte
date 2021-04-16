<script>
  import Chart from '@reuters-graphics/parliament-chart';
  import { onMount } from 'svelte';
  import debounce from 'lodash/debounce.js';
  export let title;
  export let chatter;

  const colours = (p) => {
    switch (p.id) {
      case 'a':
        return '#2c6075';
      case 'b':
        return '#7ebfc1';
      case 'c':
        return '#d1eeea';
      case 'd':
        return '#ffd430';
      case 'e':
        return '#cda200';
      default:
        return 'lightgrey';
    }
  };

  onMount(() => {
    const chart = new Chart();
    chart
      .selection('#parliament-chart')
      .data([
        { id: 'a', seats: 150 },
        { id: 'b', seats: 125 },
        { id: 'c', seats: 75 },
        { id: 'd', seats: 50 },
        { id: 'e', seats: 25 },
        { id: 'f', seats: 10 },
      ])
      .props({
        circle: {
          fill: colours,
        },
      })
      .draw();
  
    const resize = debounce(() => { chart.draw(); }, 250);
    window.addEventListener('resize', resize);
  });
</script>

<section class='graphic'>
  <h3>{title}</h3>
  <p>{chatter}</p>
  <div id='parliament-chart'></div>
</section>

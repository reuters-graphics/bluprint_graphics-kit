<script>
  import Chart from '@reuters-graphics/parliament-chart';
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';

  onMount(() => {
    const chart = new Chart();
    chart
      .selection('#parliament-chart')
      .data([
        { id: "gop",seats: 211 },
        { id: "dem",seats: 221 }
      ])
      .props({
        circle: {
          fill: (p) => p.id === 'gop' ? 'red' : 'blue',
        }
      })
      .draw();
  })
</script>

<section class='graphic'>
  <h3>{$_('chartTitle')}</h3>
  <p>{$_('chartChatter')}</p>
  <div id='parliament-chart'></div>
</section>

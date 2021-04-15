<script>
import { onMount } from 'svelte';
import pym from 'pym.js';

let pymChild;

onMount(() => {
  pymChild = new pym.Child({ polling: 500 });
});
</script>
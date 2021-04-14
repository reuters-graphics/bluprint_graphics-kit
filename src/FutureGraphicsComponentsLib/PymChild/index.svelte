<script>
import { onMount } from 'svelte';
import pym from 'pym.js';

let childFrame;

onMount(() => {
  childFrame = new pym.Child({ polling: 500 });
});
</script>
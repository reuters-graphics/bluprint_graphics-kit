<script>
  /* Add ai2svelte files here. */
  import Ai2Svelte1 from '../ai2html/step-1.svelte';
  import Ai2Svelte2 from '../ai2html/step-2.svelte';
  import Ai2Svelte3 from '../ai2html/step-3.svelte';

  /* Don't touch the code below. */
  export let index;
  export let blurbs;
</script>

<h1>Step: {index}</h1>

<div class="ai2svelte {index === 1 ? 'visible' : 'hidden'}" step="1">
  <Ai2Svelte1 />
</div>
<div class="ai2svelte {index === 2 ? 'visible' : 'hidden'}" step="2">
  <Ai2Svelte2 />
</div>
<div class="ai2svelte {index === 3 ? 'visible' : 'hidden'}" step="3">
  <Ai2Svelte3 />
</div>

<style lang="scss">
  div {
    width: 100%;
    position: absolute;
    transition: 0.5s opacity ease;
    opacity: 0;

    &.visible {
      opacity: 1;
    }
  }
</style>

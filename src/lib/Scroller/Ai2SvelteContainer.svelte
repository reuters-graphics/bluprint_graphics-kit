<script>
  /* Add ai2svelte files here. */
  import Step1 from '../ai2html/step-1.svelte';
  import Step2 from '../ai2html/step-2.svelte';
  import Step3 from '../ai2html/step-3.svelte';

  /* Don't touch the code below. */
  export let index;

  /* 
  Check with Feilding:
  - Should we separate the Ai2SvelteContainer.svelte from the index.svelte?
  - Is there a way to clean up the index logic to control opacity in this component? Current version assumes you always want to show the bototm layers. Should we make options for when you don't want the previous layers to show? If so, what to do about flashing?
  
- Add an small empty section at end by default? Or make the last section taller by default?
  */
</script>

<h1>Step index: {index}</h1>

<!-- <div
  class="ai2svelte {index === 1 ? '' : index === 2 ? '' : 'hidden'}"
  step="1"
> -->
<div class="ai2svelte" step="1">
  <Step1 />
</div>
<!-- <div
  class="ai2svelte {index === 2 ? '' : index === 3 ? '' : 'hidden'}"
  step="2"
> -->
<div class="ai2svelte {index === 1 ? 'hidden' : ''}" step="2">
  <Step2 />
</div>
<div class="ai2svelte {index === 3 ? '' : 'hidden'}" step="3">
  <Step3 />
</div>

<style lang="scss">
  .ai2svelte {
    width: 100%;
    position: absolute;
    transition: 0.5s opacity ease;

    &.hidden {
      opacity: 0;
    }
  }
</style>

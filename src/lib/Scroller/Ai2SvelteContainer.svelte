<script>
  /* Add ai2svelte files here. */
  import Step1 from '../ai2html/step-1.svelte';
  import Step2 from '../ai2html/step-2.svelte';
  import Step3 from '../ai2html/step-3.svelte';
  import Step4 from '../ai2html/step-4.svelte';

  /* Make sure the name you assign in the import lines above 
  match what you put in allSteps.
  */
  const allSteps = [
    { step: 1, ai2svelte: Step1 },
    { step: 2, ai2svelte: Step2 },
    { step: 3, ai2svelte: Step3 },
    { step: 4, ai2svelte: Step4 },
    // add more objects if you have more steps
  ];

  /* Don't touch the lines below. */
  export let index;
  const lastStep = allSteps.length;

  /* 
  Check with Feilding:
  - Should we separate the Ai2SvelteContainer.svelte from the index.svelte?
- logic ok?  
- Add an small empty section at end by default? Or make the last section taller by default?
  */
</script>

<!-- You can delete the line below -->
<h2>Step: {index}, total steps: {lastStep}</h2>

<!-- Generally, dont' touch the html codes below -->
{#each allSteps as stepObj, i}
  <!-- <div class="ai2svelte {index === i + 1 ? '' : 'hidden'}" step="{i + 1}"> -->
  <div
    class="ai2svelte-step 
    {i + 1 == 1
      ? 'visible'
      : index === i + 1
      ? 'visible'
      : i + 1 < index
      ? 'visible'
      : index === lastStep
      ? 'visible'
      : 'hidden'}"
    step="{i + 1}"
  >
    <svelte:component this="{stepObj.ai2svelte}" />
  </div>
{/each}

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

<script>
  /* 
  README!
  This is where you add your ai2svelte graphics.
  The only thing you need to do is to import your ai2svelte components and
  add them to the array allSteps.
  Make sure you add the components in order inside allSteps.
  */

  // Add ai2svelte files here.
  import Step1 from '../ai2html/step-1.svelte';
  import Step2 from '../ai2html/step-2.svelte';
  import Step3 from '../ai2html/step-3.svelte';
  import Step4 from '../ai2html/step-4.svelte';

  // Make sure the name you assign in the import lines
  // match what you put in allSteps.
  const allSteps = [Step1, Step2, Step3, Step4];

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

<!-- You can uncomment the line below to see what step you're on -->
<!-- <h2>Step: {index}, total steps: {lastStep}</h2> -->

<!-- Generally, dont' touch the html codes below -->
{#each allSteps as stepComponent, i}
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
    <svelte:component this="{stepComponent}" />
  </div>
{/each}

<style lang="scss">
  .ai2svelte-step {
    width: 100%;
    position: absolute;
    transition: 0.5s opacity ease;

    &.hidden {
      opacity: 0;
    }
  }
</style>

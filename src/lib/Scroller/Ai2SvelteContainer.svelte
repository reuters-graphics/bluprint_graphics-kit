<script>
  // import { onMount, beforeUpdate, afterUpdate } from 'svelte';

  export let index;
  export let blurbs;

  const componentNames = [];
  blurbs.forEach((blurb) => {
    componentNames.push(blurb.ComponentName);
  });

  const lastStep = componentNames.length;
  let Ai2svelteGraphic = null;

  $: {
    let id = index - 1;
    if (index > lastStep) {
      id = lastStep;
    }

    const fetchComponent = async () => {
      try {
        Ai2svelteGraphic = (
          await import(`../ai2html/${componentNames[id]}.svelte`)
        ).default;
      } catch (e) {
        console.log(
          `Unable to load ai2svelte component at: ${componentNames[id]}.`,
          e
        );
      }
    };
    fetchComponent();
  }

  // onMount(() => {
  //   componentNames.forEach(async (componentName) => {
  //     try {
  //       Ai2svelteGraphic = (await import(`../ai2html/${componentName}.svelte`))
  //         .default;
  //       components.push(Ai2svelteGraphic);
  //     } catch (e) {
  //       console.log(
  //         `Unable to load ai2svelte component at: ${componentName}.`,
  //         e
  //       );
  //     }
  //   });
  // });

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
{#each componentNames as componentName, i}
  <!-- <div class="ai2svelte {index === i + 1 ? '' : 'hidden'}" step="{i + 1}"> -->
  <div
    class="ai2svelte-step 
    {i + 1 === 1
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
    <!-- <svelte:component this="{stepComponent}" /> -->
    <svelte:component this="{Ai2svelteGraphic}" />
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

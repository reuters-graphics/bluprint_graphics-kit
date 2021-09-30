<script>
  // import { onMount, beforeUpdate, afterUpdate } from 'svelte';
  import { assets } from '$app/paths';

  export let index;
  export let blurbs;

  let componentsArray = [];
  const componentNames = [];
  blurbs.forEach((blurb) => {
    componentNames.push(blurb.ComponentName);
  });

  const lastStep = componentNames.length;
  let Ai2svelteGraphic = null;

  /*
  STYLES
  - prop for blurb position and alignment
  - prop for visual position and alignment

  - Nix other components (keep for myself)
  - delete preview
  - add scroller yarn to package.json
  */

  const fetchComponent = async () => {
    const objArray = [];
    for (const componentName of componentNames) {
      try {
        Ai2svelteGraphic = (await import(`../${componentName}.svelte`)).default;
      } catch (e) {
        console.log(
          `Unable to load ai2svelte component at: ${componentName}.`,
          e
        );
      }
      const obj = {};
      obj.componentName = componentName;
      obj.component = Ai2svelteGraphic;
      objArray.push(obj);
    }
    componentsArray = objArray.slice();
  };
  fetchComponent();
  // $: console.log('componentsArray', componentsArray);

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
{#each componentsArray as component, i}
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
    <svelte:component this="{componentsArray[i].component}" assets="{assets}" />
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

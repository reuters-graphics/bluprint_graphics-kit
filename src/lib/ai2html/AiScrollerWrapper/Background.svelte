<script>
  import { assets } from '$app/paths';

  export let index;
  export let steps = [];

  let Ai2svelteGraphics = [];

  const componentNames = steps.map((step) => step.ComponentName);

  const fetchComponents = async () => {
    const components = [];
    for (const componentName of componentNames) {
      try {
        const Component = (await import(`../${componentName}.svelte`)).default;
        components.push({
          Component,
          componentName,
        });
      } catch (e) {
        console.error(
          `Unable to load ai2svelte component at: ai2html/${componentName}.svelte.`,
          e
        );
      }
    }
    Ai2svelteGraphics = [...components];
  };
  fetchComponents();
</script>

{#each Ai2svelteGraphics as Ai2svelteGraphic, i}
  <!-- Load the step before and after the active one, only -->
  {#if i >= index - 1 && i <= index + 1}
    <div
      class="ai2svelte-scroller-step"
      class:visible="{i <= index}"
      class:hidden="{i > index}"
      step="{i + 1}"
    >
      <svelte:component this="{Ai2svelteGraphic.Component}" assets="{assets}" />
    </div>
  {/if}
{/each}

<style lang="scss">
  .ai2svelte-scroller-step {
    width: 100%;
    position: absolute;
    transition: 0.5s opacity ease;

    &.hidden {
      opacity: 0;
    }
  }
</style>

<script>
  import { assets } from '$app/paths';

  export let componentName;
  export let component = null;
  export let id;
  export let size;

  let Ai2svelteGraphic = component;

  const fetchComponent = async () => {
    // Allow passing the component directly as a prop
    if (Ai2svelteGraphic) return;
    try {
      Ai2svelteGraphic = (await import(`../${componentName}.svelte`)).default;
    } catch (e) {
      console.log(
        `Unable to load ai2svelte component at: ai2html/${componentName}.svelte.`,
        e
      );
    }
  };
  fetchComponent();
</script>

<section class="ai2svelte graphic {size}" id="{id}">
  {#if $$slots.title}
    <slot name="title" />
  {/if}

  <svelte:component this="{Ai2svelteGraphic}" assets="{assets}" />

  {#if $$slots.notes}
    <slot name="notes" />
  {/if}
</section>

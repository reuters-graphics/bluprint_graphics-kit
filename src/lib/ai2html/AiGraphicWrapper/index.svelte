<script>
  /* This component wraps ai2svelte graphics. */
  import { assets } from '$app/paths';

  export let componentName;
  export let component = null;
  export let id = '';
  // normal, wide, wider, widest or fluid
  export let size = 'normal';

  let Ai2svelteGraphic = component;

  const fetchComponent = async () => {
    if (Ai2svelteGraphic) return;
    try {
      Ai2svelteGraphic = (await import(`../${componentName}.svelte`)).default;
    } catch (e) {
      console.error(
        `Unable to load ai2svelte component at: ai2html/${componentName}.svelte.`,
        e
      );
    }
  };
  fetchComponent();
</script>

<section class="ai2svelte-container graphic {size}" id="{id}">
  {#if $$slots.title}
    <slot name="title" />
  {/if}

  <svelte:component this="{Ai2svelteGraphic}" assets="{assets}" />

  {#if $$slots.notes}
    <slot name="notes" />
  {/if}
</section>

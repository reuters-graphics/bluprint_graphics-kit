<script>
  import { onMount } from 'svelte';
  import marked from 'marked';

  export let title;
  export let id;
  export let chatter;
  export let source;
  export let note;
  export let size;

  let Ai2svelteGraphic = null;
  let filePath = `./ai2html/${id}.svelte`;

  onMount(async () => {
    try {
      Ai2svelteGraphic = (await import(filePath)).default;
    } catch (e) {
      console.log(
        'Error with your ai2svelte. Check Ai2svelte.svelte component',
        e
      );
    }
  });
</script>

<section class="ai2svelte graphic {size}" id="{id}">
  {#if title}
    <h3>{title}</h3>
  {/if}
  {#if chatter}
    <p>{chatter}</p>
  {/if}

  <svelte:component this="{Ai2svelteGraphic}" />

  <aside>
    {#if note}
      <p class="note">
        Note: {@html marked.parseInline(note)}
      </p>
    {/if}
    {#if source}
      <p class="source">Source: {@html marked.parseInline(source)}</p>
    {/if}
  </aside>
</section>

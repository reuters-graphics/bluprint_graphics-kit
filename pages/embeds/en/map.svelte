<script>
  import content from '$locales/en/content.json';
  import { PymChild } from '@reuters-graphics/graphics-svelte-components';
  import Map from '$lib/ai2svelte/ai-chart.svelte';

  // Reuters Graphics components lib (see below)
  import { Ai2svelte } from '@reuters-graphics/graphics-svelte-components';

  // Styles
  import '@reuters-graphics/style-theme-eisbaer/scss/main.scss';
  import '$lib/styles/global.scss';
  import { truthyString } from '$utils/truthyString';
</script>

<div class="embed-graphic">
  {#each content.blocks as block}
    {#if block.Type === 'ai2svelte-map'}
      <Ai2svelte
        AiGraphic="{Map}"
        id="{block.Type}"
        size="{block.Size}"
        ariaHidden="{truthyString(block.AriaHidden)}"
        ariaDescription="{block.AltText}"
      >
        <div slot="title" class="title">
          {#if block.Title}<h4>{block.Title}</h4>{/if}
          {#if block.Chatter}<p>{block.Chatter}</p>{/if}
        </div>
        <aside slot="notes">
          {#if block.Note}<p class="note">Note: {block.Note}</p>{/if}
          {#if block.Source}<p class="source">Source: {block.Source}</p>{/if}
        </aside>
      </Ai2svelte>
    {/if}
  {/each}
</div>
<PymChild polling="{500}" />

<script>
  // Content from your Google doc
  import content from '$locales/en/content.json';

  // Import components you make here, incuding ai2svelte components.
  // "$lib" below is shortcut for the src/lib/ directory
  import Map from '$lib/ai2svelte/ai-chart.svelte';

  // Reuters Graphics components lib (see below)
  import {
    BodyText,
    EndNotes,
    Headline,
    Ai2svelte,
  } from '@reuters-graphics/graphics-svelte-components';

  // Other dependencies you need here
  import { apdate } from 'journalize';
  import { marked } from 'marked';
  import { truthyString } from '$utils/truthyString';

  import img1 from '$images/reuters-graphics.jpg';

  export let embedded = false;
</script>

<article class="container-fluid" class:embedded>
  <!--
    This Headline and other components are part of our components library.
    📚 Read the docs: https://reuters-graphics.github.io/graphics-svelte-components/
  -->
  <Headline section="{content.Kicker}" hed="{content.Hed}" dek="{content.Dek}">
    <span slot="byline">By {@html marked.parseInline(content.Byline)} </span>
    <div slot="dateline">
      Published <time datetime="{content.Published}">
        {apdate(new Date(content.Published))}</time
      >
      {#if content.Updated}
        <br /> Updated
        <time datetime="{content.Updated}">
          {apdate(new Date(content.Updated))}
        </time>
      {/if}
    </div>
  </Headline>

  <img src="{img1}" width="400" alt="test" />

  <!-- 🔁 Looping through your Google doc blocks... -->
  {#each content.blocks as block}
    <!-- Text block -->
    {#if block.Type === 'text'}
      <BodyText text="{block.Text}" />

      <!-- Ai2svelte graphic block -->
    {:else if block.Type === 'ai2svelte-map'}
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
    {:else}
      {console.warn(`Unknown block type: ${block.Type}`)}
    {/if}
  {/each}

  <EndNotes text="{content.EndNotes}" />
</article>

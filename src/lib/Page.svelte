<script>
  // Content from your Google doc
  import content from '$locales/en/content.json';

  // Reuters Graphics components lib (see below)
  import {
    BodyText,
    Image,
    EndNotes,
    Headline,
    Ai2svelte,
    Scroller,
  } from '@reuters-graphics/graphics-svelte-components';

  // Other dependencies
  import { apdate } from 'journalize';
  import { marked } from 'marked';
  import { fetchComponent, makeScrollerSteps } from '$utils/dynamicComponents';

  export let embedded = false;
</script>

<article class="container-fluid">
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

  <!-- 🔁 Looping through your Google doc blocks... -->
  {#each content.blocks as block}
    <!-- Text block -->
    {#if block.Type === 'text'}
      <BodyText text="{block.Text}" />

      <!-- Photo block -->
    {:else if block.Type === 'photo'}
      <Image
        src="{block.Src}"
        caption="{block.Caption}"
        alt="{block.AltText}"
        wider
      />

      <!-- Ai2svelte block -->
    {:else if block.Type === 'ai2svelte'}
      {#await fetchComponent(block.ComponentName)}
        <div></div>
      {:then component}
        <Ai2svelte
          AiGraphic="{component}"
          id="{block.ComponentName}"
          size="{block.Size}"
          ariaHidden="{block.AriaHidden}"
        >
          <div slot="title" class="title">
            {#if block.Title}<h4>{block.Title}</h4>{/if}
            {#if block.Chatter}<p>{block.Chatter}</p>{/if}
          </div>
          <div slot="srDescription">
            {#if block.SRDescription}
              <div class="sr-only">
                {@html marked.parse(block.SRDescription)}
              </div>
            {:else if !block.SRDescription || block.SRDescription == ''}
              <h5 class="warning">
                Screen-reader description is missing. Add SRDescription: in
                google doc
              </h5>
            {/if}
          </div>
          <aside slot="notes">
            {#if block.Note}<p class="note">Note: {block.Note}</p>{/if}
            {#if block.Source}<p class="source">Source: {block.Source}</p>{/if}
          </aside>
        </Ai2svelte>
      {:catch error}
        {console.error(
          `Error fetching component: ./ai2svelte/${block.ComponentName}.svelte`,
          error
        )}
      {/await}

      <!-- Scroller block -->
    {:else if block.Type === 'ai-scroller'}
      {#await makeScrollerSteps(block.steps)}
        <div></div>
      {:then steps}
        <Scroller
          steps="{steps}"
          backgroundSize="{block.BackgroundSize}"
          foregroundPosition="{block.ForegroundPosition}"
          id="{block.ID}"
          embedded="{embedded}"
          stackBackground="{block.StackBackground}"
        />
      {:catch error}
        {console.error('Error making steps for scroller', error)}
      {/await}
      <!-- ?? -->
    {:else}
      {console.warn(`Unknown block type: ${block.Type}`)}
    {/if}
  {/each}

  <EndNotes text="{content.EndNotes}" />
</article>

<style lang="scss">
  article.container-fluid {
    overflow-x: hidden;
  }

  :global {
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
    .warning {
      color: red;
    }
  }
</style>

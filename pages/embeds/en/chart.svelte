<script>
  import { PymChild } from '@reuters-graphics/graphics-svelte-components';
  import content from '$locales/en/content.json';
  import { Ai2svelte } from '@reuters-graphics/graphics-svelte-components';
  import { fetchComponent } from '$utils/dynamicComponents';
</script>

<article>
  {#each content.blocks as block}
    {#if block.Type === 'ai2svelte'}
      {#await fetchComponent(block.ComponentName)}
        <div></div>
      {:then component}
        <Ai2svelte
          AiGraphic="{component}"
          id="{block.ComponentName}"
          size="{block.Size}"
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
      {:catch error}
        {console.error(
          `Error fetching component: ./ai2svelte/${block.ComponentName}.svelte`,
          error
        )}
      {/await}
    {/if}
  {/each}
</article>

<PymChild polling="{500}" />

<!-- svelte-ignore css-unused-selector -->
<style lang="scss">
  @import '~@reuters-graphics/style-main/scss/fonts/font-faces';
  :global {
    @import '@reuters-graphics/style-theme-eisbaer/scss/main';
    article {
      overflow: auto;
      section.graphic {
        margin: 0 auto;
      }
    }
  }
</style>

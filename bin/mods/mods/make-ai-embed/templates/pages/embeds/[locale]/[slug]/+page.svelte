<script lang="ts">
  import type { PageProps } from './$types';
  import { asset } from '$app/paths';
  import { page } from '$app/state';
  import {
    Theme,
    Article,
    EmbedMetadata,
    GraphicBlock,
  } from '@reuters-graphics/graphics-components';
  import LogBlock from '$lib/components/dev/LogBlock.svelte';
  import Graphic from '$lib/ai2svelte/ai-chart.svelte';

  // Styles
  import '@reuters-graphics/graphics-components/scss/main.scss';
  import '$lib/styles/global.scss';

  let { data }: PageProps = $props();
  let { embed } = data;
</script>

<EmbedMetadata
  baseUrl={__BASE_URL__}
  pageUrl={page.url}
  previewImgPath={embed ?
    asset(`/images/embeds/${embed.locale?.trim()}/${embed.slug?.trim()}.jpg`)
  : asset('/images/reuters-graphics.jpg')}
  polling={500}
/>

<Theme base="light">
  <Article
    embedded={true}
    columnWidths={{
      narrower: 330,
      narrow: 510,
      normal: 708,
      wide: 930,
      wider: 1076,
    }}
  >
    {#if !embed}
      <LogBlock level="warn" message="Missing embed in ArchieML doc" />
    {/if}
    {#if embed && !embed?.altText}
      <LogBlock level="warn" message="Missing altText in embeds ArchieML doc" />
    {/if}
    <GraphicBlock
      class="!my-0"
      width="normal"
      textWidth="normal"
      snap={false}
      title={embed?.title}
      description={embed?.description}
      notes={embed?.notes}
      ariaDescription={embed?.altText}
    >
      <Graphic assetsPath={asset('/')} />
    </GraphicBlock>
  </Article>
</Theme>

<style>
  :global(article.embedded) {
    padding: 0 !important;
  }
  :global(.article-block.notes) {
    margin-inline-start: 0 !important;
  }
  @media (max-width: 1023.98px) {
    :global(.article-block.graphic) {
      margin-inline-start: 0 !important;
    }
  }
  :global(body) {
    background-color: #ffffff;
  }
  :global(h3) {
    margin-top: 0 !important;
  }
</style>

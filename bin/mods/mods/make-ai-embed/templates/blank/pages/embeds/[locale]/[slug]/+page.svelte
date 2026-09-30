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
  import { containerWidth } from '$utils/propValidators';
  // 1. Import the component you want to embed, e.g.:
  // import Graphic from '$lib/components/Graphic.svelte';

  // Styles
  import '@reuters-graphics/graphics-components/scss/main.scss';
  import '$lib/styles/global.scss';

  let { data }: PageProps = $props();
  let embed = $derived(data.embed);
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
      <LogBlock
        level="warn"
        message="Missing embed in ArchieML doc. Add one with locale: [locale] and slug: [slug]"
      />
    {/if}
    {#if embed && !embed?.altText}
      <LogBlock level="warn" message="Missing altText in embeds ArchieML doc" />
    {/if}
    <!-- GraphicBlock props come from this embed in the embeds RNGS doc (locale: [locale], slug: [slug]); placeholders show until it's there -->
    <GraphicBlock
      width={containerWidth(embed?.width ?? 'normal')}
      textWidth={containerWidth(embed?.textWidth ?? 'normal')}
      snap={false}
      title={embed ? embed.title : 'Embed title'}
      description={embed ?
        embed.description
      : '**Embed description** from `description` in the embeds RNGS doc'}
      notes={embed ?
        embed.notes
      : '**Embed notes** from `notes` in the embeds RNGS doc'}
      ariaDescription={embed?.altText}
    >
      <!-- 2. Put your component here, inside the GraphicBlock, e.g. <Graphic /> -->
      <div class="embed-placeholder">
        <p><strong>Your graphic goes here</strong></p>
        <p>pages/embeds/[locale]/[slug]/+page.svelte</p>
      </div>
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
  /* Also trims components that render their own GraphicBlock, e.g. DatawrapperChart */
  :global(.article-block.graphic) {
    margin-block: 0 !important;
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
  .embed-placeholder {
    display: grid;
    place-content: center;
    min-height: 300px;
    padding: 1rem;
    border: 2px dashed var(--theme-colour-brand-rules);
    text-align: center;
    text-wrap: balance;
    overflow-wrap: anywhere;
  }
</style>

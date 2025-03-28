<script lang="ts">
  import type { PageProps } from './$types';
  import { assets } from '$app/paths';
  import { page } from '$app/state';
  import {
    Theme,
    PymChild,
    SEO,
    GraphicBlock,
  } from '@reuters-graphics/graphics-components';
  import LogBlock from '$lib/components/dev/LogBlock.svelte';
  import Graphic from '$lib/ai2svelte/ai-graphic.svelte';

  // Styles
  import '@reuters-graphics/graphics-components/scss/main.scss';
  import '$lib/styles/global.scss';

  let { data }: PageProps = $props();
  let { embed } = data;
</script>

<SEO
  baseUrl={import.meta.env.BASE_URL}
  pageUrl={page.url}
  seoTitle=""
  seoDescription=""
  shareTitle=""
  shareDescription=""
  shareImgPath={embed ?
    `${assets}/images/embeds/${embed.locale?.trim()}/${embed.slug?.trim()}.jpg`
  : `${assets}/images/reuters-graphics.jpg`}
/>

<svelte:head>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<Theme base="light">
  {#if !embed}
    <LogBlock level="warn" message="Missing embed in ArchieML doc" />
  {/if}
  {#if embed && !embed?.altText}
    <LogBlock level="warn" message="Missing altText in embeds ArchieML doc" />
  {/if}
  <GraphicBlock
    class="!my-0"
    title={embed?.title}
    description={embed?.description}
    notes={embed?.notes}
    ariaDescription={embed?.altText}
  >
    <Graphic assetsPath={assets} />
  </GraphicBlock>
</Theme>

<PymChild polling={500} />

<style>
  :global(h3) {
    margin-top: 0 !important;
  }
</style>

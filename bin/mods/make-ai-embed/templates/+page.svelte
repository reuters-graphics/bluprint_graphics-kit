<script lang="ts">
  import { assets } from '$app/paths';
  import { page } from '$app/state';
  import {
    Theme,
    PymChild,
    SEO,
    GraphicBlock,
  } from '@reuters-graphics/graphics-components';
  import LogBlock from '$lib/components/dev/LogBlock.svelte';

  interface EmbedsArchieML {
    story: {
      embeds: {
        locale: string;
        slug: string;
        title?: string;
        description?: string;
        notes?: string;
        altText?: string;
      }[];
    };
  }

  import archieML from '$locales/en/embeds.json';

  // Styles
  import '@reuters-graphics/graphics-components/scss/main.scss';
  import '$lib/styles/global.scss';
  import Graphic from '$lib/ai2svelte/ai-graphic.svelte';

  let content = $derived(archieML.story as EmbedsArchieML['story']);

  const embed = $derived.by(() =>
    content.embeds.find(({ locale, slug }) => {
      return page.route.id === `/embeds/${locale?.trim()}/${slug?.trim()}`;
    })
  );
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

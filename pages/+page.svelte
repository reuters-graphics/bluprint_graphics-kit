<script lang="ts">
  import {
    AdScripts,
    SEO,
    SiteHeader,
    SiteFooter,
    EmbedPreviewerLink,
    LeaderboardAd,
    Theme,
  } from '@reuters-graphics/graphics-components';
  import App from '$lib/App.svelte';
  import pkg from '$pkg';
  import { dev } from '$app/environment';
  import { assets } from '$app/paths';
  import { page } from '$app/stores';
  import { isReutersApp, isReutersDev, isReutersDotcom } from '$utils/env';
  import LogBlock from '$lib/components/dev/LogBlock.svelte';

  // Styles
  import '@reuters-graphics/graphics-components/scss/main.scss';
  import '$lib/styles/global.scss';
  import type { PageData } from './$types';

  export let data: PageData;

  $: content = data.content;
</script>

{#if isReutersDotcom($page.url)}
  <AdScripts />
{/if}

<SEO
  baseUrl="{import.meta.env.BASE_URL}"
  pageUrl="{$page.url}"
  seoTitle="{content.seoTitle}"
  seoDescription="{content.seoDescription}"
  shareTitle="{content.shareTitle}"
  shareDescription="{content.shareDescription}"
  shareImgPath="{`${assets}/${content.shareImgPath}`}"
  shareImgAlt="{content.shareImgAlt}"
  publishTime="{pkg?.reuters?.graphic?.published}"
  updateTime="{pkg?.reuters?.graphic?.updated}"
  authors="{pkg?.reuters?.graphic?.authors}"
/>

<Theme base="light">
  {#if !isReutersApp($page.url)}
    {#if isReutersDotcom($page.url)}
      <LeaderboardAd />
    {:else if isReutersDev($page.url)}
      <LogBlock level="info" message="An ad will appear here on dotcom" />
    {/if}
    <SiteHeader />
  {/if}

  <App {content} />

  {#if !isReutersApp($page.url)}
    <SiteFooter />
  {/if}
</Theme>

<!-- Only visible in dev! -->
<EmbedPreviewerLink {dev} />

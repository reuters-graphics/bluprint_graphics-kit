<script lang="ts">
  import {
    SEO,
    SiteHeader,
    SiteFooter,
    EmbedPreviewerLink,
    Theme,
  } from '@reuters-graphics/graphics-components';
  import App from '$lib/App.svelte';
  import pkg from '$pkg';
  import { dev } from '$app/environment';
  import { assets } from '$app/paths';
  import { page } from '$app/stores';
  import { isReutersApp } from '$utils/env';
  import archieML from '$locales/en/content.json';

  // Styles
  import '@reuters-graphics/graphics-components/scss/main.scss';
  import '$lib/styles/global.scss';

  $: content = archieML.story;
</script>

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
    <SiteHeader />
  {/if}

  <App {content} />

  {#if !isReutersApp($page.url)}
    <SiteFooter />
  {/if}
</Theme>

<!-- Only visible in dev! -->
<EmbedPreviewerLink {dev} />

<script>
  import {
    Analytics,
    SEO,
    Sharer,
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
  import { browser } from '$app/environment';

  // Google doc content
  import content from '$locales/en/content.json';

  // Styles
  import '@reuters-graphics/graphics-components/scss/main';
  import '$lib/styles/global.scss';

  // Checks for Reuters mobile app using search params
  const isReutersMobileApp =
    browser && $page.url?.searchParams.get('outputType') === 'chromeless';
</script>

{#if /\Wreuters\.com$/.test($page.url?.hostname)}
  <Analytics authors="{pkg?.reuters?.graphic?.authors}" />
{/if}

<SEO
  baseUrl="{import.meta.env.BASE_URL}"
  pageUrl="{$page.url}"
  seoTitle="{content.SEOTitle}"
  seoDescription="{content.SEODescription}"
  shareTitle="{content.ShareTitle}"
  shareDescription="{content.ShareDescription}"
  shareImgPath="{`${assets}/${content.ShareImgPath}`}"
  shareImgAlt="{content.ShareImgAlt}"
  publishTime="{pkg?.reuters?.graphic?.published}"
  updateTime="{pkg?.reuters?.graphic?.updated}"
  authors="{pkg?.reuters?.graphic?.authors}"
/>

<Theme base="light">
  {#if !isReutersMobileApp}
    <SiteHeader />
  {/if}

  <App {content} />

  {#if !isReutersMobileApp}
    <Sharer />
    <SiteFooter />
  {/if}
</Theme>

<!-- Only visible in dev! -->
<EmbedPreviewerLink {dev} />

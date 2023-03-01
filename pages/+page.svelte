<script>
  import {
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

  // Google doc content
  import content from '$locales/en/content.json';

  // Styles
  import '$lib/styles/global.scss';
</script>

<SEO
  lang="en"
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
  includeAnalytics="{/\Wreuters\.com$/.test($page.url?.hostname)}"
/>

<Theme base="light">
  <SiteHeader />
  <App content="{content}" />
  <Sharer />
  <SiteFooter />
</Theme>

<!-- Only visible in dev! -->
<EmbedPreviewerLink dev="{dev}" />

<script>
  import App from '$lib/App.svelte';
  import content from '$locales/en/content.json';
  import { PymChild, SEO } from '@reuters-graphics/graphics-components';
  import pkg from '$pkg';
  import { assets } from '$app/paths';
  import { page } from '$app/stores';

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
  publishTime="{pkg?.reuters?.graphic?.published}"
  updateTime="{pkg?.reuters?.graphic?.updated}"
  authors="{pkg?.reuters?.graphic?.authors}"
  includeAnalytics="{$page.url.hostname === 'graphics.reuters.com'}"
/>

<App embedded="{true}" />

<PymChild polling="{500}" />

<script>
  import pkg from '$pkg';
  import { assets } from '$app/paths';
  import { page } from '$app/stores';
  import { Theme, PymChild, SEO } from '@reuters-graphics/graphics-components';

  // Google doc content
  import content from '$locales/en/content.json';

  // App or embeddable chart component
  import App from '$lib/App.svelte';

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
  <App embedded="{true}" content="{content}" />
</Theme>

<PymChild polling="{500}" />

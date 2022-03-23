<script>
  import Page from '$lib/Page.svelte';
  import content from '$locales/en/content.json';
  import { PymChild, SEO } from '@reuters-graphics/graphics-svelte-components';

  // Styles
  import '@reuters-graphics/style-theme-eisbaer/scss/main.scss';
  import '$lib/styles/global.scss';
</script>

<SEO
  seoTitle="{content.SEOTitle}"
  seoDescription="{content.SEODescription}"
  shareTitle="{content.ShareTitle}"
  shareDescription="{content.ShareDescription}"
  shareImgPath="{content.ShareImgPath}"
  lang="en"
/>

<Page embedded="{true}" />

<PymChild polling="{500}" />

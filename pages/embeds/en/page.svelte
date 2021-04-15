<script>
import { SEO } from 'reuters-components';
import Page from '$lib/Page.svelte';
import content from '$locales/en/content.json';
import { PymChild } from 'reuters-components';
</script>

<SEO 
  seoTitle={content.SEOTitle}
  seoDescription={content.SEODescription}
  shareTitle={content.ShareTitle}
  shareDescription={content.ShareDescription}
  shareImgPath='images/shark.jpg'
  lang='en'
/>

<Page />

<PymChild/>

<style lang="scss">
:global {
  @import "@reuters-graphics/style-theme-eisbaer/scss/main";
}
</style>
  
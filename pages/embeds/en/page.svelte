<script>
  import Page from '$lib/Page.svelte';
  import content from '$locales/en/content.json';
  import { PymChild, SEO } from '@reuters-graphics/graphics-svelte-components';
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

<!-- svelte-ignore css-unused-selector -->
<style lang="scss">
  @import '~@reuters-graphics/style-main/scss/fonts/font-faces';
  :global {
    @import '@reuters-graphics/style-theme-eisbaer/scss/main';
    article {
      overflow: auto;
    }
  }
</style>

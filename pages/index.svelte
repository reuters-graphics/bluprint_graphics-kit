<script>
  import {
    SEO,
    Sharer,
    Referrals,
    Nav,
    Footer,
    EmbedPreviewerLink,
  } from 'reuters-components';
  import Page from '$lib/Page.svelte';
  import content from '$locales/en/content.json';
</script>

<SEO
  seoTitle="{content.SEOTitle}"
  seoDescription="{content.SEODescription}"
  shareTitle="{content.ShareTitle}"
  shareDescription="{content.ShareDescription}"
  shareImgPath="images/reuter-graphics.jpg"
  lang="en"
/>

<Nav />
<Page />
<Sharer />
<Referrals />
<Footer />

<!-- Only visible in dev! -->
<EmbedPreviewerLink />

<style lang="scss">
  @import '~@reuters-graphics/style-main/scss/fonts/font-faces';
  :global {
    @import '@reuters-graphics/style-theme-eisbaer/scss/main';
  }
</style>

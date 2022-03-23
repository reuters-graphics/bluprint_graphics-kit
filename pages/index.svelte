<script>
  import {
    SEO,
    Sharer,
    Referrals,
    Nav,
    Footer,
    EmbedPreviewerLink,
  } from '@reuters-graphics/graphics-svelte-components';
  import Page from '$lib/Page.svelte';
  import content from '$locales/en/content.json';

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

<Nav />
<Page />
<Sharer />
<Referrals />
<Footer />

<!-- Only visible in dev! -->
<EmbedPreviewerLink />

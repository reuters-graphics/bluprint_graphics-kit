<script lang="ts">
  import pkg from '$pkg';
  import { assets } from '$app/paths';
  import { page } from '$app/state';
  import { Theme, PymChild, SEO } from '@reuters-graphics/graphics-components';

  import archieML from '$locales/en/content.json';

  // App or embeddable chart component
  import App from '$lib/App.svelte';

  // Styles
  import '@reuters-graphics/graphics-components/scss/main.scss';
  import '$lib/styles/global.scss';

  let content = $derived(archieML.story);
</script>

<SEO
  baseUrl={import.meta.env.BASE_URL}
  pageUrl={page.url}
  seoTitle={content.seoTitle}
  seoDescription={content.seoDescription}
  shareTitle={content.shareTitle}
  shareDescription={content.shareDescription}
  shareImgPath={`${assets}/${content.shareImgPath}`}
  shareImgAlt={content.shareImgAlt}
  publishTime={pkg?.reuters?.graphic?.published}
  updateTime={pkg?.reuters?.graphic?.updated}
  authors={pkg?.reuters?.graphic?.authors}
/>

<Theme base="light">
  <App embedded={true} {content} />
</Theme>

<PymChild polling={500} />

<style>
  :global(.headline-container) {
    margin-top: 0;
  }
  :global(.headline) {
    margin-top: 0;
  }
</style>

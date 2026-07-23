<script lang="ts">
  import { asset } from '$app/paths';
  import { page } from '$app/state';
  import { Theme, EmbedMetadata } from '@reuters-graphics/graphics-components';

  import archieML from '$locales/en/content.json';

  // App or embeddable chart component
  import App from '$lib/App.svelte';

  // Styles
  import '@reuters-graphics/graphics-components/scss/main.scss';
  import '$lib/styles/global.scss';

  let content = $derived(archieML.story);
</script>

<EmbedMetadata
  baseUrl={__BASE_URL__}
  pageUrl={page.url}
  previewImgPath={asset(`/${content.shareImgPath}`)}
  polling={500}
/>

<Theme base="light">
  <App embedded={true} {content} />
</Theme>

<style>
  :global(.headline-container) {
    margin-top: 0;
  }
  :global(.headline) {
    margin-top: 0;
  }
</style>

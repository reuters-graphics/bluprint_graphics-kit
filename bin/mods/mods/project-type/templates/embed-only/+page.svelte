<script lang="ts">
  import { SEO } from '@reuters-graphics/graphics-components';

  import { assets } from '$app/paths';
  import { page } from '$app/state';
  import { isReutersDotcom, isReutersPreview } from '$utils/env';
</script>

<SEO
  baseUrl={import.meta.env.BASE_URL}
  pageUrl={page.url}
  seoTitle=""
  seoDescription=""
  shareTitle=""
  shareDescription=""
  shareImgPath={`${assets}/images/reuters-graphics.jpg`}
/>

<svelte:head>
  <meta name="robots" content="noindex, nofollow" />

  {#if !isReutersDotcom(page.url) || isReutersPreview(page.url)}
    <meta http-equiv="refresh" content="0; URL='./embed-previewer/'" />
  {:else}
    <meta
      http-equiv="refresh"
      content="0; URL='https://www.reuters.com/graphics/'"
    />
  {/if}
</svelte:head>

<script>
  import {
    SiteHeader,
    SiteFooter,
    Theme,
    Article,
  } from '@reuters-graphics/graphics-components';

  // Styles
  import '$lib/styles/global.scss';
  import { browser } from '$app/environment';
  import { page } from '$app/state';

  let { children } = $props();

  // Checks for Reuters mobile app using search params
  const isReutersMobileApp =
    browser && page.url?.searchParams.get('outputType') === 'chromeless';
</script>

<Theme base="light">
  {#if !isReutersMobileApp}
    <SiteHeader />
  {/if}
  <Article>
    {@render children?.()}
  </Article>
  {#if !isReutersMobileApp}
    <SiteFooter />
  {/if}
</Theme>

<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/state';

  // Styles
  import '$lib/styles/global.scss';

  // Components
  import {
    SiteHeader,
    SiteFooter,
    Theme,
    Article,
  } from '@reuters-graphics/graphics-components';

  let { children } = $props();

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

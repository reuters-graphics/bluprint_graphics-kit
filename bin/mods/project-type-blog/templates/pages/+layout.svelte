<script lang="ts">
  import {
    SiteHeader,
    SiteFooter,
    Theme,
    Article,
  } from '@reuters-graphics/graphics-components';
  import { browser } from '$app/environment';
  import { page } from '$app/state';

  import '$lib/styles/global.scss';

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

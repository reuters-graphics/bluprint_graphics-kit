<script>
  // @ts-ignore
  import pages from '@svelte-kit-pages';
  import { Framer } from '@reuters-graphics/graphics-svelte-components';
  import { base } from '$app/paths';

  const embeds = pages
    .filter((p) => /^\/embeds\//.test(p))
    .map((path) => base + path);
</script>

<Framer embeds="{embeds}" />

<style lang="scss">
  :global(body) {
    padding-bottom: 60px;
    background-color: #fafafa;
  }
</style>

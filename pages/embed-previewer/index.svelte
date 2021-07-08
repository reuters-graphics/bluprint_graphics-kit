<script>
  import pages from '@svelte-kit-pages';
  import { Framer } from '@reuters-graphics/graphics-svelte-components';

  const embeds = pages.filter((p) => /^\/embeds\//.test(p));
</script>

<Framer embeds="{embeds}" />

<style lang="scss">
  :global(body) {
    padding-bottom: 60px;
    background-color: #fafafa;
  }
</style>

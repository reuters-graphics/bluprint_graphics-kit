<script>
  // @ts-ignore
  import pages from '@svelte-kit-pages';
  import { Framer } from '@reuters-graphics/graphics-components';
  import { base } from '$app/paths';

  const embeds = pages
    .filter((p) => /^\/embeds\//.test(p))
    .map((path) => `${base}/${path.replace(/^\//, '')}`)
    .map((path) => (/\/$/.test(path) ? path : path + '/'));
</script>

<Framer embeds="{embeds}" />

<style global>
  body {
    padding-bottom: 60px;
    background-color: #fafafa;
  }
</style>

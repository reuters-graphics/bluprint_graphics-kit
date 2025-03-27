<script>
  // @ts-ignore Is OK
  import pages from '@svelte-kit-pages';
  import { Framer } from '@reuters-graphics/graphics-components';
  import { base } from '$app/paths';

  const embeds = pages
    .filter((p) => /^\/embeds\//.test(p))
    .map((path) => `${base}/${path.replace(/^\//, '')}`)
    .map((path) => (/\/$/.test(path) ? path : path + '/'));
</script>

{#if embeds.length}
  <Framer {embeds} />
{:else}
  <container>
    <div>
      <div>No embeds found.</div>
      <div>
        <a href="{base}/">Go back</a>
      </div>
    </div>
  </container>
{/if}

<style lang="scss">
  @use '@reuters-graphics/graphics-components/dist/scss/mixins' as mixins;

  :global(body) {
    padding-bottom: 60px;
    background-color: #fafafa;
  }
  container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80svh;
    width: 100%;
    & > div {
      text-align: center;
      font-family: sans-serif;
    }
  }
</style>

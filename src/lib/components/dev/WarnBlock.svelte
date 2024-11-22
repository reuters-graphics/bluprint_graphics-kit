<!-- @component Adds a warning message to the page. Only visible in development. -->
<script lang="ts">
  import { dev } from '$app/environment';
  import { Block } from '@reuters-graphics/graphics-components';

  export let message: string;
</script>

{#if dev}
  <Block>
    <div>
      <span>WARN</span>
      {message}
    </div>
  </Block>
{/if}

<style lang="scss">
  div {
    margin: 15px 0;
    color: #000;
    background-color: #ffe0e0;
    padding: 0.75rem;
    font-family: monospace;
    font-size: 0.85rem;
    span {
      display: inline-block;
      background-color: #dc3545;
      color: white;
      padding: 2px 5px 2px 5px;
      border-radius: 2px;
    }
  }
</style>

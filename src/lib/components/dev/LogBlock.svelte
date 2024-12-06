<script lang="ts">
  import { page } from '$app/stores';
  import { isReutersDev } from '$utils/env';
  import { Block } from '@reuters-graphics/graphics-components';

  /**
   * A message to display
   */
  export let message: string;
  /**
   * The level of the message, either `warn` or `info`
   */
  export let level: 'warn' | 'info' = 'warn';
</script>

{#if isReutersDev($page.url)}
  <!-- This log will only appear in development. -->
  <Block>
    <div class="{level}">
      <span>{level.toUpperCase()}</span>
      {message}
    </div>
  </Block>
{/if}

<style lang="scss">
  div {
    margin: 15px 0;
    padding: 0.75rem;
    font-family: monospace;
    font-size: 0.85rem;
    border-radius: 4px;

    span {
      display: inline-block;
      padding: 2px 5px;
      border-radius: 2px;
    }

    &.warn {
      color: #000;
      background-color: #ffe0e0;
      border: 1px solid #ffbebe;
      span {
        background-color: #dc3545;
        color: white;
      }
    }

    &.info {
      color: #000;
      background-color: #e0f7ff;
      border: 1px solid #d2dcff;
      span {
        background-color: #007bff;
        color: white;
      }
    }
  }
</style>

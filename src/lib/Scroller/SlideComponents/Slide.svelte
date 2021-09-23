<script>
  import Ai2Svelte from './Ai2Svelte.svelte';
  import HebrewPrayer from './HebrewPrayer.svelte';
  import HebrewPrayerNonbinary from './HebrewPrayerNonbinary.svelte';

  export let index;
  export let scrollBlock; //scrollBlock of text from google doc
</script>

<p>Slide {index}</p>

{#if scrollBlock.Ai2SvelteID}
  <!-- <Ai2Svelte scrollBlock="{scrollBlock}" /> -->
  <Ai2Svelte
    id="{scrollBlock.Ai2SvelteID}"
    step="{scrollBlock.Ai2SvelteStep}"
  />

  <!-- {:else if scrollBlock.Type === 'quote'}
  test -->
{:else if scrollBlock.SlideID === 'hebrew-prayer'}
  <div class="hebrew-prayer-container">
    {#if scrollBlock.Step === '1'}
      <HebrewPrayer />
    {:else if scrollBlock.Step === '2'}
      <HebrewPrayerNonbinary />
    {/if}
  </div>
{/if}

<style lang="scss">
  .hebrew-prayer-container {
    left: 0;
    position: absolute;
    // border: 1px solid red;
  }
</style>

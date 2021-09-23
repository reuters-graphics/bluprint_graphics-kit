<script>
  import { onMount } from 'svelte';

  import Slide from './SlideComponents/Slide.svelte';
  import GlobeTrotter from './SlideComponents/GlobeTrotter.svelte';
  // import Headline from '../Headline.svelte';
  // import Blockquote from './SlideComponents/Blockquote.svelte';

  export let index; // index starts at 1
  export let scrollBlocks;
  let ready = false;

  onMount(() => {
    ready = true;
  });

  // $: outerWidth = 0;
</script>

<!-- <svelte:window bind:outerWidth /> -->

{#if ready}
  <div class="bg-container">
    <GlobeTrotter index="{index}" scrollBlocks="{scrollBlocks}" />

    <div index="{index}" class="slide-container">
      <!-- Loop through blocks in google doc and make a slide for each block. 
        Check if the slide ID matches scroll index and add "visible" or "hidden" class -->
      {#each scrollBlocks as block, i}
        <!-- <div
          class="{block.Type == 'quote' ? 'blockquote' : ''} slide {index ==
          i + 1
            ? 'visible'
            : 'hidden'}"
          id="{i + 1}"
        > -->
        <div class="slide {index == i + 1 ? 'visible' : 'hidden'}" id="{i + 1}">
          <Slide index="{index}" scrollBlock="{block}" />
        </div>
      {/each}
    </div>
  </div>
{/if}

<style lang="scss">
  @import '~@reuters-graphics/style-main/scss/fonts/variables';
  @import '~@reuters-graphics/style-color/scss/all';

  $teal: #a0cec7;
  $mustard: #d9c67a;
  $softPurple: #cbc5e0;
  $darkTeal: #016969;

  .bg-container {
    height: 100%;

    .slide-container {
      position: absolute;
      top: 0;
      width: 100%;
      // border: 2px solid green;

      // @media only screen and (max-width: 650px) {
      //   width: 100%;
      // }
    }
    .slide {
      transition: opacity 0.5s ease;
      width: 100%;
      position: absolute;
      // opacity: 0;
      // border: 2px solid green;

      &.headline {
        top: 50%; // vertically centre
        transform: translate(0, 50%);
      }
      &.hidden {
        opacity: 0;
      }
      &.visible {
        opacity: 1;
      }
    }
  }

  /* @media (min-width: 700px) and (max-width: 1024px) {
    #scroll-chart {
      margin-top: 4rem;
    }
  } */
</style>

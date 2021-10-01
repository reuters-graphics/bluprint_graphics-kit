<script>
  /* This component wraps a scroller for ai2svelte graphics. */
  import Scroller from '@sveltejs/svelte-scroller';
  import Background from './Background.svelte';
  import Foreground from './Foreground.svelte';

  export let id = '';
  // An array of objects with ComponentName and Text properties
  export let steps = [];
  // normal, wide, wider, widest or fluid
  export let graphicSize = 'fluid';
  // middle, left, right, left opposite or right opposite
  export let textPosition = 'middle';

  let index = 0;
  let offset, progress;
</script>

<section class="scroll-container fluid" id="{id}">
  <Scroller bind:index bind:offset bind:progress>
    <div
      slot="background"
      class="background"
      class:right="{textPosition === 'left opposite'}"
      class:left="{textPosition === 'right opposite'}"
    >
      <div class="graphic-well">
        <section
          class="background-container graphic {graphicSize}"
          step="{index + 1}"
        >
          <Background index="{index}" steps="{steps}" />
        </section>
      </div>
    </div>

    <div slot="foreground" class="foreground {textPosition}">
      <Foreground steps="{steps}" />
    </div>
  </Scroller>
</section>

<style lang="scss">
  .scroll-container {
    margin-top: 5rem;
    margin-bottom: 5rem;
  }

  div.background {
    min-height: 100vh;
    position: relative;
    padding: 0;
    display: flex;
    justify-content: center;

    &.left {
      width: 50%;
      float: left;
      @media (max-width: 1200px) {
        justify-content: center;
        width: 100%;
        float: initial;
      }
    }
    &.right {
      width: 50%;
      float: right;
      @media (max-width: 1200px) {
        justify-content: center;
        width: 100%;
        float: initial;
      }
    }

    div.graphic-well {
      padding: 0 15px;
      width: 100%;
      section.graphic.background-container {
        margin-top: 0;
        margin-bottom: 0;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        &.fluid {
          margin: 0 0 0 -15px;
        }
      }
    }
  }

  div.foreground {
    width: 100%;

    &.right {
      width: 50%;
      float: right;
      @media (max-width: 1200px) {
        width: 100%;
        float: initial;
      }
    }

    &.left {
      width: 50%;
      float: left;
      @media (max-width: 1200px) {
        width: 100%;
        float: initial;
      }
    }
  }
</style>

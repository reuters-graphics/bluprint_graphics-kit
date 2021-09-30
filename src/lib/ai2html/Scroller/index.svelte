<script>
  /*
  README!
If using this scroller component, follow these steps.

1. If using ai2svelte for the first time, add this to your Adobe Illustrator settings:
https://github.com/reuters-graphics/ai2svelte/blob/master/ai2svelte.js
Tip: I like to name the file **ai2svelt.js so that it's easy to differentiate it from the ai2html.js script.

2. If using ai2svelte, change the ai2html settings in your .ai files to what's listed here:
https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/docs/developers/ai.md

3. In your google doc, add a section for your scroller. It's already in the google doc by default.

4. If you want, change the css for blurbs or for section.empty in the style section at the bottom.

Otherwise, in general, you don't need to touch the code in this file.
*/

  import Scroller from '@sveltejs/svelte-scroller';
  import marked from 'marked';
  import Ai2SvelteContainer from './Ai2SvelteContainer.svelte';

  export let id;
  export let blurbs; // blurbs from google doc
  export let graphicSize;
  export let blurbPosition;

  // innerWidth makes sure the background is full width and doesn't move when it sticks.
  // If your visuals aren't full width, you can adjust width fo [slot='background'] in the scss
  $: innerWidth = 0;
  let index = 0;
  let offset, progress;
</script>

<svelte:window bind:innerWidth />
<div class="scroll-container tktk" id="{id}">
  <Scroller bind:index bind:offset bind:progress>
    <div slot="background" bind:clientWidth="{innerWidth}">
      <section
        class="ai2svelte-container {graphicSize} {blurbPosition === 'left'
          ? 'right'
          : blurbPosition === 'right'
          ? 'left'
          : 'middle'}"
        step="{index + 1}"
        style="width:{innerWidth + 30}px"
      >
        <Ai2SvelteContainer index="{index + 1}" blurbs="{blurbs}" />
      </section>
    </div>

    <div slot="foreground" class="{blurbPosition}">
      {#each blurbs as blurb}
        <section>
          <div class="blurb" id="blurb-{index + 1}">
            {@html marked(blurb.Text)}
          </div>
        </section>
      {/each}

      <!-- Add an extra section at the end to make last slide 
      stay on screen for longer. Can delete. -->
      <section class="empty"></section>
    </div>
  </Scroller>
</div>

<style lang="scss">
  @import '~@reuters-graphics/style-color/scss/all';

  // You can adjust the margin to add space between the scroll section and its surrounding sections
  .scroll-container {
    margin-top: 5rem;
    margin-bottom: 5rem;
  }

  section {
    height: 100vh;
    display: flex;
    align-items: center; /* makes text blurbs vertically centred */

    // Can customise blurb styles
    .blurb {
      max-width: 550px;
      width: 100%;
      padding: 1.2rem 30px 0 30px;
      margin: auto;
      background: rgba(255, 255, 255, 0.8); /* change blurb colour here */
    }

    // This is the extra empty section at the end of the scroll section
    // that lets the reader stay on the last step for a little longer.
    &.empty {
      height: 20vh;
    }
  }

  // In general, don't touch the styles below
  .ai2svelte-container {
    position: relative;
    padding: 0;

    &.left {
      margin-left: 0;
    }
    &.right {
      margin-right: 0;
    }
    &.top-0 {
      align-items: start;
    }

    // Make graphic fluid if window width < 1200px
    @media only screen and (max-width: 1200px) {
      margin: auto;
      max-width: none !important;
    }
  }

  [slot='background'] {
    margin-left: -15px;
  }

  [slot='foreground'] {
    width: 100%;
    margin: auto;

    &.right {
      width: 50%;
      float: right;
    }

    &.left {
      width: 50%;
      float: left;
    }

    // Centre blurbs if window width < 1200px
    @media only screen and (max-width: 1200px) {
      width: 100% !important;
      margin: auto !important;
    }
  }
</style>

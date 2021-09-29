<script>
  /*
  README!
If using this scroller component, follow these steps.

1. Run yarn add @sveltejs/svelte-scroller

2. If using ai2svelte for the first time, add this to your Adobe Illustrator settings:
https://github.com/reuters-graphics/ai2svelte/blob/master/ai2svelte.js
Tip: I like to name the file **ai2svelt.js so that it's easy to differentiate it from the ai2html.js script.

3. If using ai2svelte, change the ai2html settings in your .ai files to what's listed here:
https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/docs/developers/ai.md

4. In your google doc, add a section for your scroller.
To do this, add the block that starts with Type: scroller in the notes section at the top
to inside the [blocks] section in your google doc.

5. Run yarn get-google

6. In Ai2Svelte Container.svelte, import your ai2svelte files (see instructions there).

7. If you want, change the css for blurbs or section.empty in the style section at the bottom.

Otherwise, in general, you don't need to touch the code in this file.
*/

  import Scroller from '@sveltejs/svelte-scroller';
  import marked from 'marked';
  import Ai2SvelteContainer from './Ai2SvelteContainer.svelte';

  export let id;
  export let blurbs; // blurbs from google doc

  // innerWidth makes sure the background is full width and doesn't move when it sticks.
  // If your visuals aren't full width, you can adjust width fo [slot='background'] in the scss
  $: innerWidth = 0;
  let index = 0; // this starts at 0 by default
  let offset, progress;
</script>

<svelte:window bind:innerWidth />
<div class="scroll-container" id="{id}">
  <Scroller bind:index bind:offset bind:progress>
    <div slot="background" bind:clientWidth="{innerWidth}">
      <div class="bg" id="bg-{index + 1}" style="width:{innerWidth + 30}px">
        <div class="ai2svelte-container">
          <Ai2SvelteContainer index="{index + 1}" blurbs="{blurbs}" />
        </div>
      </div>
    </div>

    <div slot="foreground">
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

  // You can adjust margin if you want
  .scroll-container {
    margin-top: 5rem;
    margin-bottom: 5rem;
  }

  section {
    height: 100vh;
    padding: 1em;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center; /* makes text blurbs vertically centred*/

    // Can customise .blurb styles
    .blurb {
      max-width: 550px;
      width: 100%;
      padding: 1.2rem 30px 0 30px;
      background: rgba(255, 255, 255, 0.8);
    }

    // This is the extra empty section at the end of the scroll section
    // that lets the reader stay on the last step for a little longer.
    &.empty {
      height: 20vh;
    }
  }

  // In general, don't touch the styles below
  .ai2svelte-container {
    // width: 100%;
    position: relative;
    // border: 1px solid blue;
  }

  [slot='background'] {
    margin-left: -15px;
  }

  [slot='foreground'] {
    width: 50%; // This changes blurb position
    float: right;
  }
</style>

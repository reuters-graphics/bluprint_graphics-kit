<script>
  /* 
If you're getting errors running svelte scroller, try:
yarn add @sveltejs/svelte-scroller

If you're getting errors running svelte scroller, try:
yarn add @sveltejs/svelte-scroller

If using ai2svelte, make sure you have the ai2svelt.js:
https://github.com/reuters-graphics/ai2svelte/blob/master/ai2svelte.js

AND change the settings in your ai file to what's listed here: 
https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/docs/developers/ai.md

In general, you don't need to change the code in this file.
You can change the css for blurbs in the style section at the bottom.
*/

  import Scroller from '@sveltejs/svelte-scroller';
  import marked from 'marked';
  import Ai2SvelteContainer from './Ai2SvelteContainer.svelte';

  export let blurbs; // google doc content

  // innerWidth makes sure the background is full width and doesn't move when it sticks.
  // If your visuals aren't full width, you can adjust width fo [slot='background'] in the scss
  $: innerWidth = 0;
  let index = 0; // this starts at 0 by default
  let offset, progress;
  let ready = false;
  // let reversedArray;

  // console.log(blurbs);

  import { onMount } from 'svelte';
  onMount(() => {
    ready = true;
    // let ai2SvelteDivs = document.querySelectorAll('.ai2svelte-container > div');
    // let reversedArray = Array.from(ai2SvelteDivs).reverse();

    // // Add 'step' as an attribute to each div containing ai2svelte
    // reversedArray.forEach((elem, i) => {
    //   elem.setAttribute('step', i + 1);
    // });
  });

  $: {
    console.log('index', index + 1);

    // let test = d3.select('.ai2svelte-container');

    // console.log('test', test);
    // onMount(() => {
    //   // console.log('index', index + 1);
    //   // let showThisAi2svelteDiv = document.querySelector(
    //   //   `.bg > div[step="${index + 1}"]`
    //   // );
    //   // showThisAi2svelteDiv.classList.add('show');
    //   // console.log('showThisAi2svelteDiv', index + 1, showThisAi2svelteDiv);
    // });
  }
</script>

<svelte:window bind:innerWidth />

<Scroller bind:index bind:offset bind:progress>
  <div slot="background" bind:clientWidth="{innerWidth}">
    <div class="bg" id="bg-{index + 1}" style="width:{innerWidth + 30}px">
      <!-- Section {index + 1} is now active. -->

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
    <!-- Add an extra section at the end if you want the last slide to stay on screen for longer -->
    <!-- <section class="empty"></section> -->
  </div>
</Scroller>

<style lang="scss">
  @import '~@reuters-graphics/style-color/scss/all';

  // Ai2svelte style
  .ai2svelte-container {
    width: 100%;
    position: relative;
  }

  [slot='background'] {
    height: 100vh;
    margin-left: -15px;
    // border: 2px solid blue;
  }
  .bg {
    height: 100%;
    // transition: 0.5s opacity ease;

    // &#bg-1 {
    //   background-color: pink;
    // }
    // &#bg-2 {
    //   background-color: lightblue;
    // }
    // &#bg-3 {
    //   background-color: lightseagreen;
    // }
  }

  [slot='foreground'] {
    // border: 2px solid red;
    width: 50%;
    float: right;
  }

  section {
    height: 100vh;
    padding: 1em;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center; /* makes text blurbs vertically centred*/

    // &.empty {
    //   height: 200px;
    //   border: 1px solid red;
    // }

    .blurb {
      max-width: 550px;
      width: 100%;
      padding: 1.2rem 30px 0 30px;
    }
  }
</style>

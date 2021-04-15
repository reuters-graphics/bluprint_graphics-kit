<script>
import Fa from 'svelte-fa/src/fa.svelte';
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus.js';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus.js';
import { faDesktop } from '@fortawesome/free-solid-svg-icons/faDesktop.js';
import { afterUpdate, onMount } from 'svelte';
import { browser } from '$app/env';
import pym from 'pym.js';
import urljoin from 'proper-url-join';

export let embeds;

let activeEmbed = embeds[0];

const roundToFive = (x) => Math.ceil(x / 5) * 5;
let width = 600;
let windowInnerWidth = 1200;

let pymParent;

const resize = (newWidth) => {
  localStorage.setItem('previewWidth', newWidth);
  width = newWidth;
};

const reframe = (embed) => {
  pymParent = new pym.Parent(
    'frame-parent',
    urljoin(window.location.origin, embed)
  );
}

onMount(() => {
  width = parseInt(localStorage.getItem('previewWidth')) || 600;
  reframe(activeEmbed);
});

$: if (browser) {
  reframe(activeEmbed);
}
</script>

<svelte:window bind:innerWidth={windowInnerWidth}/>

<div class='container'>
  <header>
    <img src="https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-dark.svg" alt="" />
  </header>

  <nav>
  {#each embeds as embed}
    <button
      on:click={() => { activeEmbed = embed; }}
      class:active={activeEmbed === embed}
    >
      {embed.replace('/embeds/', '')}
    </button>    
  {/each}
  </nav>

  <div id="frame-parent" style='width:{width}px;' />
</div>

<div class="resizer">
  <button
    on:click={() => resize(roundToFive(width - 5))}
    disabled={width <= 300}
  >
    <Fa icon={faMinus} />
  </button>
  <input
    type="number"
    min={300}
    max={windowInnerWidth - 25 - width}
    on:change={(e) => resize(parseInt(e.target.value))}
    value={width}
  />
  <button
    on:click={() => resize(roundToFive(width + 5))}
    disabled={windowInnerWidth - 25 - width < 5}
  >
    <Fa icon={faPlus} />
  </button>
</div>

<div id='home-link'>
  <a rel="external" href="/">
    <Fa icon={faDesktop} />
  </a>
</div>

<style lang="scss">
  @import "~@reuters-graphics/style-color/scss/thematic/brand";
  @import "~@reuters-graphics/style-main/scss/fonts/mixins";

  header {
    @include font-display;

    font-size: 50px;
    text-align: center;
    text-transform: uppercase;
    font-weight: 700;
    margin: 20px 0;
  }

  nav {
    text-align: center;
    margin-bottom: 20px;
    button {
      margin: 0 4px;
      background-color:transparent;
      border: 0;
      color: #999;
      padding: 2px 2px;
      cursor: pointer;
      &.active {
        border-bottom: 2px solid #666;
        color: #666;
      }
      &:focus {
        outline: none;
      }
    }
  }

  #frame-parent {
    border: 1px solid #ddd;
    margin: 0 auto;
    width: var(--width);
  }

  .resizer {
    padding: 10px;
    background-color:transparent;
    position: fixed;
    bottom: 0;
    right: 0;
    border-radius: 4px;


    input {
      outline: none;
      font-family: monospace;
    }

    button {
      border: 0;
      color: #ccc;
      cursor: pointer;
      outline: none;

      &:disabled {
        color: #fff;
      }

      &:hover {
        color: #999;
      }

      &:active {
        color: $brand-primary;
      }
    }
  }

  div#home-link {
    position: fixed;
    bottom: 5px;
    left: 10px;
    font-size: 18px;
    a {
      color: #ccc;
      &:hover {
        color: #666;
      }
    }
  }
</style>
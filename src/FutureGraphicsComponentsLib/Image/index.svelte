<script>
import { onMount } from 'svelte';
import { getPath } from '$utils/statics';
import classnames from 'classnames';

export let src;
export let alt;
export let caption;
export let height = 100;

export let wide = false;
export let wider = false;
export let widest = false;
export let fluid = false;

export let lazy = false;

export let top = 0;
export let bottom = 0;
export let left = 0;
export let right = 0;

let intersecting = false;
let container;
const intersectable = typeof IntersectionObserver !== 'undefined';

onMount(() => {
  if (!lazy) return;
  if (intersectable) {
    const rootMargin = `${bottom}px ${left}px ${top}px ${right}px`;

    const observer = new IntersectionObserver(entries => {
      intersecting = entries[0].isIntersecting;
      if (intersecting) {
        observer.unobserve(container);
      }
    }, {
      rootMargin,
    });

    observer.observe(container);
    return () => observer.unobserve(container);
  }
});
</script>


<figure class={classnames('photo', { wide, wider, widest, fluid })} bind:this={container}>
  {#if (!lazy || (intersectable && intersecting))}
    <img src={getPath(src)} alt={alt}>
  {:else}
    <div class='placeholder' height={`${height}px`} />
  {/if}
  {#if caption}
    <figcaption>{caption}</figcaption>
  {/if}
</figure>

<style lang='scss'>
  .placeholder{
    background-color: #ccc;
    width: 100%;
  }
</style>
<script>
import IntersectionObserver from './IntersectionObserver.svelte';
export let url;
export let image;
export let title;
export let description;
</script>

<div class='referral' title={description}>
  <a href={url}>
    <IntersectionObserver let:intersecting top={600}>
      {#if intersecting}
      <div class='image' style={`background-image: url(${image});`}></div>
      {:else}
      <div class='image'></div>
      {/if}
    </IntersectionObserver>
    <p>{title}</p>
  </a>
</div>


<style>
.image {
  width: 100%;
  padding-bottom: 50%;
  background-size: cover;
  background-position: 50%;
}
</style>
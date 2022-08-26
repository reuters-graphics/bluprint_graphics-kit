<script>
  let count = 0;
</script>

<section class="graphic">
  <h5>The count is <span>{count}</span></h5>
  <button
    on:click="{() => {
      count += 1;
    }}">Add</button
  >
</section>

<style lang="scss">
  @import '@reuters-graphics/graphics-components/dist/scss/fonts/_mixins.scss';

  section.graphic {
    h5 {
      color: blue;
      span {
        @include font-monospace;
      }
    }
  }
</style>

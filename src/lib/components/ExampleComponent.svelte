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
  @import '~@reuters-graphics/style-main/scss/fonts/mixins';

  section.graphic {
    h5 {
      color: blue;
      span {
        @include font-monospace;
      }
    }
  }
</style>

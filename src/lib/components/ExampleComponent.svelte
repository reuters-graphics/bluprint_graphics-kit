<script>
  import { Block } from '@reuters-graphics/graphics-components';
  let count = 0;
</script>

<section class="graphic">
  <Block>
    <h5>The count is <span>{count}</span></h5>
    <button
      class="rounded cursor-pointer py-2.5 px-5 uppercase text-secondary font-bold"
      on:click="{() => {
        count += 1;
      }}">Add</button
    >
  </Block>
</section>

<style lang="scss">
  @use '@reuters-graphics/graphics-components/dist/scss/mixins' as mixins;

  section.graphic {
    h5 {
      color: blue;
      span {
        @include mixins.font-mono;
      }
    }
  }
</style>

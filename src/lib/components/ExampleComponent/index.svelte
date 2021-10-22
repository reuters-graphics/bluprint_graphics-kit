<script>
  let count = 0;
</script>

<section class="graphic">
  <h5>The count is {count}</h5>
  <button
    on:click="{() => {
      count += 1;
    }}">Add</button
  >
</section>

<style lang="scss">
  section.graphic {
    h5 {
      color: blue;
    }
  }
</style>

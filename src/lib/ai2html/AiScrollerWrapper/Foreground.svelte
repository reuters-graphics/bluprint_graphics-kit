<script>
  export let steps;

  import marked from 'marked';
</script>

{#each steps as step, index}
  <section>
    <div class="step" id="step-{index + 1}">
      {@html marked(step.Text)}
    </div>
  </section>
{/each}

<!-- svelte-ignore css-unused-selector -->
<style lang="scss">
  section {
    height: 100vh;
    width: initial;
    max-width: initial;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 5rem;

    .step {
      max-width: 550px;
      width: 100%;
      padding: 1.2rem 30px;
      background: rgba(255, 255, 255, 0.8);
      :global {
        p:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
</style>

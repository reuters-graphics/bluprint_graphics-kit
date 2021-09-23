<script>
  //   export let block;
  export let id;
  export let step;

  import SpanishGerman from '../../ai2html/spanish-german.svelte';
  import HowAreYou from '../../ai2html/how-are-you.svelte';
  import ThaiPronounI from '../../ai2html/thai-pronoun-i.svelte';
</script>

<div class="ai2svelte-container" id="{id}" step="{step}">
  {#if id == 'spanish-german'}
    <SpanishGerman />
  {:else if id == 'how-are-you'}
    <HowAreYou />
  {:else if id == 'thai-pronoun-i'}
    <ThaiPronounI />
  {:else if id == 'hebrew-prayer'}
    HEBREW PRAYER
  {/if}
</div>

<!-- <%- include('../ai2html/' + block.ID + '.ejs' ); %> -->
<style lang="scss">
  :global(.ai2svelte-container div) {
    // background: lightgrey;
    margin-left: 15px !important;
  }

  #spanish-german {
    :global(.possessive-german) {
      font-weight: 600;
    }

    &[step='2'] {
      //   :global(.spanish-phrase-ai2html) {
      //     opacity: 1 !important;
      //   } // this doesn't prevent flashing
      :global(.german-phrase-ai2html) {
        opacity: 1 !important;
      }
    }
    &[step='3'] {
      :global(.german-phrase-ai2html) {
        opacity: 1 !important;
      }
      :global(.adj) {
        display: inline-block;
        font-weight: 600;
      }
      :global(.noun-spanish) {
        left: 84.5% !important;
      }
      :global(.noun-german) {
        left: 94% !important;
      }
    }
  }

  #how-are-you {
    &[step='2'] {
      :global(.hindi) {
        opacity: 1;
      }
      :global(.arabic) {
        opacity: 1;
      }
    }

    &[step='3'] {
      :global(.hindi) {
        opacity: 1;
      }
      :global(.arabic) {
        opacity: 1;
      }
      :global(.vietnamese) {
        opacity: 1;
      }
    }
  }
</style>

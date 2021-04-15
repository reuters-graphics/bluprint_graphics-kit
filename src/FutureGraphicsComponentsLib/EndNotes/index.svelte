<script>
import marked from 'marked';
export let text;

if (!text) throw new Error('"text" prop must be defined as a string for BodyText components');
</script>

<section class='end-notes'>
  {@html marked(text)}
</section>
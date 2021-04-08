<script>
import marked from 'marked';
export let text;
</script>

<section class='body-text'>
  {@html marked(text)}
</section>
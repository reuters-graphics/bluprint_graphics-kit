<script>
import pages from '@svelte-kit-pages';
import { Framer } from '@reuters-graphics/svelte-page-components';

const embeds = pages.filter(p => /^\/embeds\//.test(p));
</script>

<Framer {embeds} />
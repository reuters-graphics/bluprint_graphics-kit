<script>
import Chart from '$lib/Chart.svelte';
import { PymChild } from '@reuters-graphics/svelte-page-components';
import '$lib/translations';
import { init } from 'svelte-i18n';
init({ initialLocale: 'en' });
</script>

<PymChild />
<article class='container-fluid'>
	<Chart />
</article>
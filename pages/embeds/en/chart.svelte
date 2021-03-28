<script>
	import Chart from '$lib/Chart.svelte';

	import '$lib/translations';
	import { init } from 'svelte-i18n';
	init({ initialLocale: 'en' });
</script>

<article class='container-fluid'>
	<Chart />
</article>
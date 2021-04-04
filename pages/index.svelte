<script>
	import Page from '$lib/Page.svelte';
	import '$lib/translations';
	import { assets } from '$app/paths';

	import { init } from 'svelte-i18n';
	
	init({ initialLocale: 'en' });
</script>

<svelte:head>
	<meta property="og:image" content={`${assets}/${('images/shark.jpg').replace(/^\/+/, '')}`}>
</svelte:head>

<Page />


<style lang="scss">
	:global {
		@import "@reuters-graphics/style-theme-eisbaer/scss/main";
	}
</style>

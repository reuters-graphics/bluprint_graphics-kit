<script>
	import Page from '$lib/Page.svelte';
	import '$lib/translations';

	import { init } from 'svelte-i18n';
	
	init({ initialLocale: 'en' });
</script>


<Page />


<style lang="scss">
	:global {
		@import "@reuters-graphics/style-theme-eisbaer/scss/main";
	}
</style>

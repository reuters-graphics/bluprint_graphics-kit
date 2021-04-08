<script>
	import Page from '$lib/Page.svelte';
	import '$lib/translations';
	import { assets } from '$app/paths';
	import SEO from '../src/FutureComponentLib/SEO/index.svelte'

	import { init } from 'svelte-i18n';
	
	init({ initialLocale: 'en' });
</script>

<SEO 
	seoTitle='My page'
	seoDescription='My description'
	shareTitle='myShareTitle'
	shareDescription='My share description'
	shareImgPath='images/shark.jpg'
	locale='en'
/>

<Page />


<style lang="scss">
	:global {
		@import "@reuters-graphics/style-theme-eisbaer/scss/main";
	}
</style>

<script>
	import { page } from '$app/stores';
	import SEO from '../../src/FutureComponentLib/SEO/index.svelte';
</script>

<SEO 
	seoTitle='My second page'
	seoDescription='My second description'
	shareTitle='My second share title'
	shareDescription='My second description'
	shareImgPath='images/deeper/images/shark.jpg'
	locale='en'
/>

<main>
	<h1>{page}</h1>
</main>

<style lang="scss">
	:root {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
	}

	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4rem;
		font-weight: 100;
		line-height: 1.1;
		margin: 4rem auto;
		max-width: 14rem;
	}
	@media (min-width: 480px) {
		h1 {
			max-width: none;
		}
	}
</style>

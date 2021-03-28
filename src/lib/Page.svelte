<script>
	import Image from '../FutureComponentLib/Image/index.svelte';
	import Nav from '../FutureComponentLib/Nav/index.svelte';
	import Footer from '../FutureComponentLib/Footer/index.svelte';
	import BodyText from '../FutureComponentLib/BodyText/index.svelte';

	import { _ } from 'svelte-i18n';
	import Chart from './Chart.svelte';
</script>

<Nav />

<article class='container-fluid'>
	<section class="headline">
		<p class="section-title color-red">Reuters Internet Fashion</p>
		<h2 class="">{$_('title')}</h2>
		<p>Cold simple theme for features and graphics.</p>
	</section>
	<BodyText text={$_('story')} />
	<Chart />
	<BodyText text={$_('story')} />
	<Image src='/images/shark.jpg' alt='a shark' caption='Photo by Jon' wider />
	<BodyText text={$_('story')} />
</article>

<Footer />

<script>
import Page from '$lib/Page.svelte';
import '$lib/translations';
import { SEO, Sharer, Referrals, Nav, Footer, EmbedPreviewerLink } from '@reuters-graphics/svelte-page-components';

import { init } from 'svelte-i18n';

init({ initialLocale: 'en' });
</script>

<SEO 
	seoTitle='My page'
	seoDescription='My description'
	shareTitle='myShareTitle'
	shareDescription='My share description'
	shareImgPath='images/shark.jpg'
	lang='en'
/>

<Nav />
<Page />
<Sharer />
<Referrals />
<Footer />

<!-- Only visible in dev! -->
<EmbedPreviewerLink />

<style lang="scss">
:global {
	@import "@reuters-graphics/style-theme-eisbaer/scss/main";
}
</style>

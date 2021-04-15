<script>
import content from '$locales/en/content.json';
import { BodyText, Image, EndNotes } from 'reuters-components';
import Chart from './Chart.svelte';
</script>

<article class='container-fluid'>
	<section class="headline">
		<p class="section-title color-red">{content.Kicker}</p>
		<h2>{content.Hed}</h2>
		<p>{content.Dek}</p>
	</section>
	{#each content.blocks as block}
		{#if block.Type === 'text'}
			 <BodyText text={block.Text} />
		{:else if block.Type === 'photo'}
			<Image
				src='images/shark.jpg'
				caption={block.Caption}
				alt={block.AltText}
				wide
			/>
		{:else if block.Type === 'graphic'}
			<Chart title={block.Title} chatter={block.Chatter} />
		{/if}
	{/each}

	<EndNotes text={content.EndNotes} />
</article>

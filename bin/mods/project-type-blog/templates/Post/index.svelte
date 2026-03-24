<script>
  import { assets, base } from '$app/paths';
  import {
    BodyText,
    BlogPost,
    FeaturePhoto,
    GraphicBlock,
  } from '@reuters-graphics/graphics-components';

  import LogBlock from '$lib/components/dev/LogBlock.svelte';

  let { content, isLastPost = false } = $props();
</script>

<BlogPost
  title={content.title || content.hed || ''}
  slugTitle={content.slugTitle || content.title || content.hed || ''}
  authors={content.authors || []}
  publishTime={content.publishedDate || content.publishTime}
  updateTime={content.updatedDate || content.updateTime}
  {base}
  {isLastPost}
>
  {#each content.blocks || [] as block}
    {#if block.type === 'text'}
      <BodyText class="!fmt-4" text={block.text || ''} />
    {:else if block.type === 'photo'}
      <FeaturePhoto
        src={`${assets}/${block.src}`}
        altText={block.altText}
        caption={block.caption}
        lazy={true}
        width={block.width || 'normal'}
      />
    {:else if block.type === 'ai-graphic'}
      <GraphicBlock
        id={block.chart || 'ai-graphic'}
        width={block.width || 'normal'}
        textWidth={block.textWidth || 'normal'}
        title={block.title}
        description={block.description}
        notes={block.notes}
        ariaDescription={block.altText}
      >
        <LogBlock
          message={`Add chart component mapping for "${block.chart}"`}
        />
      </GraphicBlock>
    {:else}
      <LogBlock message={`Unknown block type: "${block.type}"`} />
    {/if}
  {/each}
</BlogPost>

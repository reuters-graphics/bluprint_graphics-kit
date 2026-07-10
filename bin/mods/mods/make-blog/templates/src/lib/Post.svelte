<script lang="ts">
  import { asset, resolve } from '$app/paths';
  import {
    BodyText,
    GraphicBlock,
    BlogPost,
  } from '@reuters-graphics/graphics-components';
  import { containerWidth } from '$utils/propValidators';
  import type { PostStory } from './post';

  // Import ai2svelte components...
  import AiMap from '$lib/ai2svelte/ai-chart.svelte';

  // ...and register them here so posts can reference them by `chart` name.
  const aiCharts: Record<string, typeof AiMap> = {
    AiMap,
  };

  interface Props {
    /** A single post's story content. */
    content: PostStory;
    /** Whether this is the last post in the feed (affects trailing spacing). */
    isLastPost?: boolean;
  }

  let { content, isLastPost = false }: Props = $props();
</script>

<BlogPost
  title={content.title}
  slugTitle={content.slugTitle}
  authors={content.authors}
  publishTime={content.publishedDate}
  updateTime={content.updatedDate}
  {resolve}
  {isLastPost}
>
  {#each content.blocks as block}
    <!-- Text block -->
    {#if block.type === 'text'}
      <BodyText class="!fmt-4" text={block.text} />

      <!-- ai2svelte graphic block -->
    {:else if block.type === 'ai-graphic'}
      {#if !aiCharts[block.chart]}
        {(console.warn(`Unable to find "${block.chart}" in aiCharts.`), '')}
      {:else}
        {@const AiGraphic = aiCharts[block.chart]}
        <GraphicBlock
          id={block.chart}
          width={containerWidth(block.width)}
          textWidth={containerWidth(block.textWidth)}
          title={block.title}
          description={block.description}
          notes={block.notes}
          ariaDescription={block.altText}
        >
          <AiGraphic assetsPath={asset('/')} />
        </GraphicBlock>
      {/if}

      <!--
        Add more block types here as your posts use them, and extend the Block
        union in `$lib/post.ts` to match.
      -->
    {:else}
      {(console.warn(
        `Unknown block type: "${(block as { type: string }).type}"`
      ),
      '')}
    {/if}
  {/each}
</BlogPost>

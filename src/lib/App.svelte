<script lang="ts">
  import type ArchieML from '$locales/en/content.json';

  interface Props {
    /* Whether the app is being rendered in an embed */
    embedded?: boolean;
    /* ArchieML story content */
    content: (typeof ArchieML)['story'];
  }

  let { embedded = false, content }: Props = $props();

  import { assets } from '$app/paths';

  import {
    Article,
    Analytics,
    BodyText,
    EndNotes,
    SiteHeadline,
    GraphicBlock,
    InlineAd,
  } from '@reuters-graphics/graphics-components';
  import LogBlock from './components/dev/LogBlock.svelte';
  import { containerWidth, inlineAdNumber } from '$utils/propValidators';
  import { isReutersDotcom } from '$utils/env';
  import { page } from '$app/state';
  import pkg from '$pkg';

  // Import ai2svelte components...
  import AiMap from './ai2svelte/ai-chart.svelte';

  // ...and add them to this object.
  const aiCharts = {
    AiMap,
  };
</script>

{#if !embedded && isReutersDotcom(page.url)}
  <Analytics authors={pkg?.reuters?.graphic?.authors || []} />
{/if}

<Article>
  <!--
    This component and others are part of our components library.
    📚 Read the docs: https://reuters-graphics.github.io/graphics-components/
  -->
  <SiteHeadline
    hed={content.hed}
    section={content.section}
    sectionUrl={content.sectionUrl}
    authors={content.authors}
    publishTime={content.publishTime}
    updateTime={content.updateTime}
  />

  <!-- 🔁 Looping through your ArchieML doc blocks... -->
  {#each content.blocks as block}
    <!-- Text block -->
    {#if block.type === 'text'}
      <BodyText text={block.text} />

      <!-- Ai2svelte graphic block -->
    {:else if block.type === 'ai-graphic'}
      {#if !aiCharts[block.chart]}
        <LogBlock message={`Unable to find "${block.chart}" in aiCharts`} />
      {:else}
        {@const AiChart = aiCharts[block.chart]}
        <GraphicBlock
          id={block.chart}
          width={containerWidth(block.width)}
          title={block.title}
          description={block.description}
          notes={block.notes}
          ariaDescription={block.altText}
        >
          <AiChart assetsPath={assets || '/'} />
        </GraphicBlock>
      {/if}

      <!-- Inline ad -->
    {:else if block.type === 'inline-ad'}
      {#if isReutersDotcom(page.url)}
        <InlineAd n={inlineAdNumber(block.n)} />
      {:else}
        <LogBlock level="info" message="An ad will appear here on dotcom" />
      {/if}

      <!-- Warning block -->
    {:else}
      <LogBlock message={`Unknown block type: "${block.type}"`} />
    {/if}
  {/each}

  <EndNotes notes={content.endNotes} />
</Article>

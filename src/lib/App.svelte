<script lang="ts">
  /* Whether the app is being rendered in an embed */
  export let embedded = false;
  /* ArchieML story content */
  export let content: (typeof ArchieML)['story'];

  import { assets } from '$app/paths';
  import type ArchieML from '$locales/en/content.json';

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

  // Import ai2svelte components...
  import AiMap from '$lib/ai2svelte/ai-chart.svelte';
  import { containerWidth, inlineAdNumber } from '$utils/propValidators';
  import { isReutersDotcom } from '$utils/env';
  import { page } from '$app/stores';
  import pkg from '$pkg';

  // ...and add them to this object.
  const aiCharts = {
    AiMap,
  };
</script>

{#if !embedded && isReutersDotcom($page.url)}
  <Analytics authors="{pkg?.reuters?.graphic?.authors || []}" />
{/if}

<Article>
  <!--
    This component and others are part of our components library.
    📚 Read the docs: https://reuters-graphics.github.io/graphics-components/
  -->
  <SiteHeadline
    hed="{content.hed}"
    section="{content.section}"
    sectionUrl="{content.sectionUrl}"
    authors="{content.authors}"
    publishTime="{content.publishedDate}"
    updateTime="{content.updatedDate}"
  />

  <!-- 🔁 Looping through your ArchieML doc blocks... -->
  {#each content.blocks as block}
    <!-- Text block -->
    {#if block.type === 'text'}
      <BodyText text="{block.text}" />

      <!-- Ai2svelte graphic block -->
    {:else if block.type === 'ai-graphic'}
      {#if !aiCharts[block.chart]}
        <LogBlock message="{`Unable to find "${block.chart}" in aiCharts`}" />
      {:else}
        <GraphicBlock
          id="{block.chart}"
          width="{containerWidth(block.width)}"
          title="{block.title}"
          description="{block.description}"
          notes="{block.notes}"
          ariaDescription="{block.altText}"
        >
          <svelte:component
            this="{aiCharts[block.chart]}"
            assetsPath="{assets || '/'}"
          />
        </GraphicBlock>
      {/if}

      <!-- Inline ad -->
    {:else if block.type === 'inline-ad'}
      {#if isReutersDotcom($page.url)}
        <InlineAd n="{inlineAdNumber(block.n)}" />
      {:else}
        <LogBlock level="info" message="An ad will appear here on dotcom" />
      {/if}

      <!-- Warning block -->
    {:else}
      <LogBlock message="{`Unknown block type: "${block.type}"`}" />
    {/if}
  {/each}

  <EndNotes notes="{content.endNotes}" />
</Article>

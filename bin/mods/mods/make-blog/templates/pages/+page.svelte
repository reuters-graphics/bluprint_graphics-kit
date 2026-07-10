<script lang="ts">
  import type { PageData } from './$types';
  import {
    Analytics,
    AdScripts,
    SEO,
    Headline,
    EndNotes,
    ClockWall,
    BlogTOC,
  } from '@reuters-graphics/graphics-components';
  import pkg from '$pkg';
  import { asset, resolve } from '$app/paths';
  import { page } from '$app/state';
  import { isReutersDotcom } from '$utils/env';

  import Post from '$lib/Post.svelte';
  import type { MainPageShell } from '$lib/post';

  // Content — content.json is the main-page shell (see $lib/post).
  import { story } from '$locales/en/content.json';
  const content = story as unknown as MainPageShell;

  // Styles
  import '@reuters-graphics/graphics-components/scss/main.scss';
  import '$lib/styles/global.scss';

  let { data }: { data: PageData } = $props();

  let tocPosts = $derived(
    data.posts.map((post) => ({
      title: post.title,
      slugTitle: post.slugTitle,
      publishTime: post.publishedDate,
    }))
  );
</script>

{#if isReutersDotcom(page.url)}
  <AdScripts />
  <Analytics authors={pkg?.reuters?.graphic?.authors || []} />
{/if}

<SEO
  baseUrl={asset('/')}
  pageUrl={page.url}
  seoTitle={content.seoTitle}
  seoDescription={content.seoDescription}
  shareTitle={content.shareTitle}
  shareDescription={content.shareDescription}
  shareImgPath={asset(`/${content.shareImgPath}`)}
  shareImgAlt={content.shareImgAlt}
  publishTime={pkg?.reuters?.graphic?.published}
  updateTime={pkg?.reuters?.graphic?.updated}
  authors={pkg?.reuters?.graphic?.authors}
/>

<Headline
  section={content.section}
  hed={content.mainHeadline}
  hedSize="big"
  width="normal"
  class="mb-2"
/>

<!-- Generic default clocks — change these cities to suit your story. -->
<ClockWall
  cities={[
    { name: 'Singapore', tzIdentifier: 'Asia/Singapore' },
    { name: 'London', tzIdentifier: 'Europe/London' },
    { name: 'New York', tzIdentifier: 'America/New_York' },
  ]}
/>

<BlogTOC posts={tocPosts} {resolve} />

{#each data.posts as post, i}
  <Post content={post} isLastPost={i === data.posts.length - 1} />
{/each}

<EndNotes notes={content.endNotes} />

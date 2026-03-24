<script>
  // Utils and libraries
  import pkg from '$pkg';
  import { base, assets } from '$app/paths';
  import { page } from '$app/state';
  import { isReutersDotcom } from '$utils/env';

  // Content
  import { story as content } from '$locales/en/content.json';

  // Styles
  import '@reuters-graphics/graphics-components/scss/main.scss';
  import '$lib/styles/global.scss';

  // Components
  import {
    AdScripts,
    Analytics,
    ClockWall,
    SEO,
    Headline,
    BlogTOC,
    EndNotes,
  } from '@reuters-graphics/graphics-components';
  import Post from '$lib/Post.svelte';

  let { data } = $props();

  let tocPosts = $derived(
    (data.posts || [])
      .map((post) => ({
        title: post.title || post.hed || 'Untitled post',
        slugTitle: post.slugTitle || post.title || post.hed || 'untitled-post',
        publishTime: post.publishedDate || post.publishTime,
      }))
      .filter((post) => !!post.slugTitle)
  );
</script>

{#if isReutersDotcom(page.url)}
  <AdScripts />
  <Analytics authors={pkg?.reuters?.graphic?.authors || []} />
{/if}

<SEO
  baseUrl={import.meta.env.BASE_URL}
  pageUrl={page.url}
  seoTitle={content.seoTitle}
  seoDescription={content.seoDescription}
  shareTitle={content.shareTitle}
  shareDescription={content.shareDescription}
  shareImgPath={`${assets}/${content.shareImgPath}`}
  shareImgAlt={content.shareImgAlt}
  publishTime={pkg?.reuters?.graphic?.published}
  updateTime={pkg?.reuters?.graphic?.updated}
  authors={pkg?.reuters?.graphic?.authors}
/>

<Headline
  section={content.section}
  hed={content.mainHeadline || content.hed}
  hedSize="big"
  width="normal"
  class="mb-2"
/>

<ClockWall
  cities={[
    { name: 'Tehran', tzIdentifier: 'Asia/Tehran' },
    { name: 'Tel Aviv', tzIdentifier: 'Asia/Tel_Aviv' },
    { name: 'Washington D.C.', tzIdentifier: 'America/New_York' },
  ]}
/>

<BlogTOC posts={tocPosts} {base} />

{#each data.posts as post, i}
  <Post content={post} isLastPost={i === data.posts.length - 1} />
{/each}

<EndNotes notes={content.endNotes} />

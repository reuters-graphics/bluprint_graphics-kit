<script lang="ts">
  import { asset, resolve } from '$app/paths';
  import { onMount } from 'svelte';
  import { story as content } from '$locales/en/content.json';
  import { SEO } from '@reuters-graphics/graphics-components';
  import Post from '$lib/Post.svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { slugify } from '$utils/slugify';
  import { isbot } from 'isbot';
  import type { PageData } from './$types';

  // Styles
  import '@reuters-graphics/graphics-components/scss/main.scss';
  import '$lib/styles/global.scss';

  let { data }: { data: PageData } = $props();

  let post = $derived(data.post);
  let authors = $derived(
    (post?.authors ?? []).map((author) => ({
      name: author.trim(),
      link: `https://www.reuters.com/authors/${slugify(author)}/`,
    }))
  );

  // Permalink pages exist for crawlers/social. Send real users to the main
  // page scrolled to this post's anchor.
  onMount(async () => {
    if (navigator.webdriver || isbot(navigator.userAgent)) return;
    await goto(`${resolve('/')}#${data.slug}`, { replaceState: true });
  });
</script>

<SEO
  baseUrl={__BASE_URL__}
  pageUrl={page.url}
  seoTitle={post?.slugTitle}
  seoDescription={post?.seoDescription}
  shareTitle={post?.title}
  shareDescription=""
  shareImgPath={asset(`/${post?.shareImgPath || content.shareImgPath}`)}
  shareImgAlt={content.shareImgAlt}
  shareImgWidth={1200}
  shareImgHeight={628}
  publishTime={post?.publishedDate}
  updateTime={post?.updatedDate}
  {authors}
  articleSection={content.section}
  keywords={post.keywords
    ?.split(',')
    .map((k) => k.trim())
    .filter(Boolean)}
  locale={content.locale}
/>

{#if post}
  <Post content={post} isLastPost={true} />
{/if}

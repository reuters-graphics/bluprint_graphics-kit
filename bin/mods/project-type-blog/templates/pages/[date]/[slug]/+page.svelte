<script lang="ts">
  // Utils, libraries and types
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import { SEO } from '@reuters-graphics/graphics-components';
  import { page } from '$app/state';
  import { assets } from '$app/paths';
  import { goto } from '$app/navigation';
  import slugify from 'slugify';
  import { isbot } from 'isbot';
  import type { PageData } from './$types';

  // Content
  import { story as content } from '$locales/en/content.json';

  // Styles
  import '@reuters-graphics/graphics-components/scss/main.scss';
  import '$lib/styles/global.scss';

  // Components — Post.svelte is created when the blog mod is applied.
  // @ts-ignore
  import Post from '$lib/Post.svelte';

  let { data }: { data: PageData } = $props();

  let post = $derived(data.post);
  let authors = $derived(
    post.authors.map((author) => ({
      name: author.trim(),
      link: `https://www.reuters.com/authors/${slugify(author, { lower: true })}/`,
    }))
  );

  onMount(async () => {
    if (navigator.webdriver || isbot(navigator.userAgent)) return;
    await goto(`${base}/#${data.slug}`, { replaceState: true });
  });
</script>

<SEO
  baseUrl={import.meta.env.BASE_URL}
  pageUrl={page.url}
  seoTitle={post.slugTitle}
  seoDescription={post.seoDescription}
  shareTitle={post.title}
  shareDescription=""
  shareImgPath={`${assets}/${post?.shareImgPath || content.shareImgPath}`}
  shareImgAlt={content.shareImgAlt}
  publishTime={post?.publishedDate}
  updateTime={post?.updatedDate}
  {authors}
/>

{#if post}
  <Post content={post} isLastPost={true} />
{/if}

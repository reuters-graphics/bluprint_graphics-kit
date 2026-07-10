// Type mocks so the blog templates type-check inside this repo. These modules
// resolve to real files only in a converted project (via the `$lib` alias); the
// base repo has no `src/lib/post.ts` or `src/lib/Post.svelte`, so we declare
// them here. This file is never copied into a project.

declare module '$lib/Post.svelte' {
  import type { Component } from 'svelte';
  const Post: Component<Record<string, unknown>>;
  export default Post;
}

declare module '$lib/post' {
  export type Block = { type: string; [key: string]: unknown };

  export interface PostStory {
    title: string;
    slugTitle: string;
    authors: string[];
    publishedDate: string;
    updatedDate: string;
    blocks: Block[];
    seoDescription?: string;
    shareImgPath?: string;
    keywords?: string;
    [key: string]: unknown;
  }

  export interface MainPageShell {
    seoTitle: string;
    seoDescription: string;
    shareTitle: string;
    shareDescription: string;
    shareImgPath: string;
    shareImgAlt: string;
    section: string;
    keywords?: string;
    locale?: string;
    mainHeadline: string;
    endNotes: { title: string; text: string }[];
  }
}

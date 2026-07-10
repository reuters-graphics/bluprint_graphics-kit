/**
 * Types for a blog post's content (the `story` object of a `locales/en/post-*.json`).
 *
 * The block union starts with the two types the scaffold renders (`text`,
 * `ai-graphic`). Add a new interface + union member here — and a matching branch
 * in `Post.svelte` — the first time a post uses another block type.
 */

export interface TextBlock {
  type: 'text';
  text: string;
}

export interface AiGraphicBlock {
  type: 'ai-graphic';
  /** Key of the component registered in `Post.svelte`'s `aiCharts`. */
  chart: string;
  width: string;
  textWidth: string;
  title?: string;
  description?: string;
  notes?: string;
  altText?: string;
}

export type Block = TextBlock | AiGraphicBlock;

export interface PostStory {
  title: string;
  slugTitle: string;
  seoTitle?: string;
  seoDescription?: string;
  shareTitle?: string;
  shareDescription?: string;
  shareImgPath?: string;
  shareImgAlt?: string;
  /** Comma-separated keywords/tags, split into an array for the SEO component. */
  keywords?: string;
  authors: string[];
  publishedDate: string;
  updatedDate: string;
  blocks: Block[];
}

/**
 * The `story` shape of `locales/en/content.json` — the blog's main-page shell
 * (metadata + a few page-level fields; the body is the list of posts).
 */
export interface MainPageShell {
  seoTitle: string;
  seoDescription: string;
  shareTitle: string;
  shareDescription: string;
  shareImgPath: string;
  shareImgAlt: string;
  section: string;
  /** Comma-separated keywords/tags, split into an array for the SEO component. */
  keywords?: string;
  /** Open Graph locale, e.g. `en_GB`. */
  locale?: string;
  mainHeadline: string;
  endNotes: { title: string; text: string }[];
}

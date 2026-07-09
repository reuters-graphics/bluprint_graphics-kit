export const prerender = true;
export const trailingSlash = 'always';

import type { LayoutServerLoad } from './$types.js';
import type { PostStory } from '$lib/post';

// Server-only: this runs at build time (all our projects prerender to static
// files), so the post-collection glob and content stay out of the client bundle.
export const load: LayoutServerLoad = async () => {
  // Every JSON file in $locales/en is a post — except content.json, which is
  // the main-page shell. Drop in a new post-*.json and it appears automatically.
  const postModules = import.meta.glob(
    ['./../locales/en/*.json', '!./../locales/en/content.json'],
    { eager: true }
  );

  const posts = Object.keys(postModules).map(
    (id) => (postModules[id] as { default: { story: PostStory } }).default.story
  );

  // Reverse-chronological (newest first).
  posts.sort(
    (a, b) =>
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );

  return { posts };
};

import { slugify } from '$utils/slugify';
import type { PageServerLoad } from './$types.js';

// Server-only: selects the post for this permalink at build time.
export const load: PageServerLoad = async ({ params, parent }) => {
  const { posts } = await parent();
  const post = posts.find((post) => slugify(post.slugTitle) === params.slug);
  return {
    slug: params.slug,
    post,
  };
};

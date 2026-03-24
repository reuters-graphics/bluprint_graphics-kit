import slugify from 'slugify';
import type { PageLoad } from './$types.js';

export const load: PageLoad = async ({ params, parent }) => {
    const { posts } = await parent();
    const post = posts.find(
        (post) => slugify(post.slugTitle, { lower: true }) === params.slug
    );
    return {
        slug: params.slug,
        post,
    };
};

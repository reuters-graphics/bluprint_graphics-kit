export const prerender = true;
export const trailingSlash = 'always';

import type { LayoutLoad } from './$types.js';
import post from '$locales/en/post-1.json';

export const load: LayoutLoad = async () => {
    // All JSON files in the locales/en directory that start with "post" and end with ".json" are considered blog posts.
    const postModules = import.meta.glob('./../locales/en/post*.json', {
        eager: true,
    });

    const posts = Object.keys(postModules)
        .map((id) => (postModules[id] as { default: typeof post }).default.story)
        .reverse();

    posts.sort((a, b) => {
        const dateA = new Date(a.publishedDate || 0).getTime();
        const dateB = new Date(b.publishedDate || 0).getTime();
        return dateB - dateA; // Sort in descending order (newest first)
    });

    return { posts };
};

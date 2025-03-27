export const prerender = true;
export const trailingSlash = 'always';

import type { LayoutLoad } from './$types.js';
import enContent from '$locales/en/content.json';

export const load: LayoutLoad = async () => {
  return { content: enContent.story };
};

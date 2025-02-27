export const prerender = true;
export const trailingSlash = 'always';

import type { LayoutLoad } from './$types.js';
import { LiveEndpoints } from '../src/utils/liveEndpoints';
import rngsioConfig from '../rngs-io.json';
import enContent from '$locales/en/content.json';

export const load: LayoutLoad = async ({ url }) => {
  const liveEndpoints = new LiveEndpoints(rngsioConfig, url);
  const { story: content } = await liveEndpoints.getLiveContent(
    'en/content',
    enContent
  );
  return { content };
};

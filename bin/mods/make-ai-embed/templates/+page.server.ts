import type { PageServerLoad } from './$types';
import { story } from '$locales/en/embeds.json';

interface Embed {
  locale: string;
  slug: string;
  title?: string;
  description?: string;
  notes?: string;
  altText?: string;
}

export const load: PageServerLoad = ({ route }) => {
  const embed = (story.embeds as Embed[]).find(({ locale, slug }) => {
    return route.id === `/embeds/${locale?.trim()}/${slug?.trim()}`;
  });

  return { embed };
};

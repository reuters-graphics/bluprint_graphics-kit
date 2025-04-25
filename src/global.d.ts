declare module '@svelte-kit-pages' {
  const embeds: string[];
  export default embeds;
}

declare module '$pkg' {
  import type { Graphic, RNGS } from '@reuters-graphics/server-client';

  type EditionType =
    | 'interactive'
    | 'media-interactive'
    | 'JPG'
    | 'EPS'
    | 'PNG'
    | 'PDF';

  type PkgArchive = {
    url: string;
    title: string;
    description: string;
    uploaded: string;
    editions: EditionType[];
  };

  export const name: string;
  export const version: string;
  export const description: string;
  export const homepage: string;
  export const reuters: {
    preview?: string;
    separateAssets?: string;
    graphic?: {
      slugs?: {
        root: string;
        wild: string;
      };
      language?: RNGS.Language;
      desk?: Graphic.Desk;
      pack?: string;
      contactEmail?: string;
      authors?: {
        name: string;
        link: string;
      }[];
      title?: string;
      description?: string;
      published?: string;
      updated?: string;
      archives?: Record<string, PkgArchive>;
    };
  };
}

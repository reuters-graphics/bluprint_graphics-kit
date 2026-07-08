import slug from 'slugify';

/**
 * Convert a string into a URL-friendly slug.
 *
 * Matches the slug the graphics-components library generates internally (e.g. in
 * `BlogPost`), so permalinks and in-page anchors line up.
 *
 * @param str - The string to slugify.
 * @returns The slugified string.
 */
export const slugify = (str: string) =>
  slug(str, { lower: true, strict: true });

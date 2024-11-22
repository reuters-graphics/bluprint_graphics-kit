import { building } from '$app/environment';

/**
 * Check if the page is being hosted inside the Reuters app.
 *
 * @example
 * ```typescript
 * import { page } from "$app/stores";
 *
 * isReutersApp($page.url);
 * ```
 * @param url URL of current page
 * @returns `true` if in the Reuters app
 */
export const isReutersApp = (url: URL) => {
  if (building) return false;
  return url.searchParams.get('outputType') === 'chromeless';
};

/**
 * Check if the page is being hosted on reuters.com
 *
 * @example
 * ```typescript
 * import { page } from "$app/stores";
 *
 * isReutersDotcom($page.url);
 * ```
 *
 * @param url URL of current page
 * @returns `true` if on reuters.com
 */
export const isReutersDotcom = (url: URL) => {
  return /\Wreuters\.com$/.test(url.hostname);
};

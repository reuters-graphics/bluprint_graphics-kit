import { building } from '$app/environment';

/**
 * Check if the page is being hosted inside the Reuters mobile app.
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
 * Check if the page is being hosted on reuters.com.
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

/**
 * Check if the page is being hosted on our preview server at graphics.thomsonreuters.com.
 *
 * @example
 * ```typescript
 * import { page } from "$app/stores";
 *
 * isReutersPreview($page.url);
 * ```
 *
 * @param url URL of current page
 * @returns `true` if on graphics.thomsonreuters.com
 */
export const isReutersPreview = (url: URL) => {
  return url.hostname === 'graphics.thomsonreuters.com';
};

/**
 * Check if the page is being hosted in development or on our preview server at graphics.thomsonreuters.com.
 *
 * @example
 * ```typescript
 * import { page } from "$app/stores";
 *
 * isReutersDev($page.url);
 * ```
 *
 * @param url URL of current page
 * @returns `true` if on dev or graphics.thomsonreuters.com
 */
export const isReutersDev = (url: URL) => {
  return url.hostname === 'localhost' || isReutersPreview(url);
};

import type { RequestEvent, Handle } from '@sveltejs/kit';
import tags from 'language-tags';

const getLang = (event: RequestEvent) => {
  // lang is encoded in URL pathname
  const matches = /\/([a-z]{2})\//g.exec(event.url.pathname);
  if (!matches) return 'en';
  if (matches[1] && tags.check(matches[1])) return matches[1];
  return 'en';
};

export const handle: Handle = async ({ event, resolve }) => {
  return resolve(event, {
    // Set lang attribute in html
    transformPageChunk: ({ html }) => html.replace('%lang%', getLang(event)),
  });
};

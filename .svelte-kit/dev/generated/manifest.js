const c = [
  () => import('../components/layout.svelte'),
  () => import('../components/error.svelte'),
  () => import('../../../pages/index.svelte'),
  () => import('../../../pages/embed-previewer/index.svelte'),
  () => import('../../../pages/embeds/en/chart.svelte'),
  () => import('../../../pages/embeds/en/page.svelte'),
];

const d = decodeURIComponent;

export const routes = [
  // pages/index.svelte
  [/^\/$/, [c[0], c[2]], [c[1]]],

  // pages/embed-previewer/index.svelte
  [/^\/embed-previewer\/?$/, [c[0], c[3]], [c[1]]],

  // pages/embeds/en/chart.svelte
  [/^\/embeds\/en\/chart\/?$/, [c[0], c[4]], [c[1]]],

  // pages/embeds/en/page.svelte
  [/^\/embeds\/en\/page\/?$/, [c[0], c[5]], [c[1]]],
];

export const fallback = [c[0](), c[1]()];

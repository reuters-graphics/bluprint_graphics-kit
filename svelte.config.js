import { getAssetsPath, getBasePath } from './bin/svelte-kit/paths/index.js';

import adapter from '@sveltejs/adapter-static';
import autoprefixer from 'autoprefixer';
import sveltePreprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: sveltePreprocess({
    preserve: ['ld+json'],
    scss: { quietDeps: true },
    postcss: {
      plugins: [autoprefixer],
    },
  }),
  kit: {
    appDir: '_app',
    // Uncomment below to disable SSR app-wide during development
    // ssr: process.env.NODE_ENV === 'production',
    paths: {
      assets: getAssetsPath(),
      base: getBasePath(),
    },
    adapter: adapter({
      pages: 'dist',
      assets: 'dist/cdn',
      fallback: null,
      precompress: false,
    }),
    trailingSlash: 'always',
    files: {
      assets: 'src/statics',
      lib: 'src/lib',
      routes: 'pages',
      appTemplate: 'src/template.html',
    },
  },
};

export default config;

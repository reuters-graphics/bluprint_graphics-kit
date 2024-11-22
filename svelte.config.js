import { getAssetsPath, getBasePath } from './bin/svelte-kit/paths/index.js';

import adapter from '@sveltejs/adapter-static';
import autoprefixer from 'autoprefixer';
import { sveltePreprocess } from 'svelte-preprocess';

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
    files: {
      assets: 'src/statics',
      lib: 'src/lib',
      routes: 'pages',
      appTemplate: 'src/template.html',
    },
    alias: {
      $lib: './src/lib',
      '$lib/*': './src/lib/*',
      '$utils/*': './src/utils/*',
      $pkg: './package.json',
      $images: './src/statics/images',
      '$images/*': './src/statics/images/*',
      '$locales/*': './locales/*',
    },
  },
};

export default config;

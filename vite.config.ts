import dsv from '@rollup/plugin-dsv';
import svelteKitPagesPlugin from './bin/svelte-kit/plugins/svelte-kit-pages/index.js';
import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
  build: { target: 'es2015' },
  server: {
    open: true,
    port: 3000,
    fs: {
      allow: ['.'],
    },
  },
  resolve: {
    alias: {
      $utils: '/src/utils',
      $pkg: '/package.json',
      $locales: '/locales',
      $assets: '/src/statics',
      $images: '/src/statics/images',
    },
  },
  css: {
    preprocessorOptions: { scss: { quietDeps: true } },
  },
  optimizeDeps: {
    exclude: ['svelte-fa'],
    include: ['classnames', 'lodash-es', 'pym.js', 'ua-parser-js'],
  },
  plugins: [
    sveltekit(),
    dsv(),
    svelteKitPagesPlugin(),
  ],
};

export default config;

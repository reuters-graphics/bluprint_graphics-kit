import { getAssetsPath, getBasePath } from './bin/svelte-kit/paths/index.js';

import adapter from '@sveltejs/adapter-static';
import autoprefixer from 'autoprefixer';
import dsv from '@rollup/plugin-dsv';
import svelteKitPagesPlugin from './bin/svelte-kit/plugins/svelte-kit-pages/index.cjs';
import sveltePreprocess from 'svelte-preprocess';

process.env.VITE_DATELINE = new Date().toISOString();

// Custom SCSS processor options...
const scss = {
  includePaths: ['src/', 'node_modules/bootstrap/scss/'],
  importer: [
    (url) => {
      // Redirect tilde-prefixed imports to node_modules
      if (/^~/.test(url))
        return { file: `node_modules/${url.replace('~', '')}` };
      return null;
    },
  ],
  quietDeps: true,
};

export default {
  preprocess: sveltePreprocess({
    preserve: ['ld+json'],
    scss,
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
    prerender: { default: true },
    trailingSlash: 'always',
    files: {
      assets: 'src/statics',
      lib: 'src/lib',
      routes: 'pages',
      template: 'src/template.html',
    },
    vite: {
      build: { target: 'es2015' },
      server: {
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
        preprocessorOptions: { scss },
      },
      optimizeDeps: {
        exclude: ['svelte-fa', '@reuters-graphics/style-theme-eisbaer'],
        include: ['classnames', 'lodash-es', 'pym.js', 'ua-parser-js'],
      },
      plugins: [dsv(), svelteKitPagesPlugin()],
    },
  },
};

import adapter from '@sveltejs/adapter-static';
import autoprefixer from 'autoprefixer';
import dsv from '@rollup/plugin-dsv';
import fs from 'fs-extra';
import svelteKitPagesPlugin from './bin/svelte-kit/plugins/svelte-kit-pages/index.cjs';
import sveltePreprocess from 'svelte-preprocess';
import url from 'url';

const getRootRelativePath = (homepageURL) => {
  if (!homepageURL) return '';
  const page = new url.URL(homepageURL);
  return homepageURL
    .replace(`${page.protocol}//${page.host}`, '')
    .replace(/\/$/, '');
};

const pkg = fs.readJSONSync(new URL('./package.json', import.meta.url));

process.env.VITE_DATELINE = new Date().toISOString();

export default {
  preprocess: sveltePreprocess({
    preserve: ['ld+json'],
    scss: {
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
    },
    postcss: {
      plugins: [autoprefixer],
    },
  }),
  kit: {
    appDir: '_app',
    // Uncomment below to disable SSR app-wide during development
    // ssr: process.env.NODE_ENV === 'production',
    paths: {
      assets:
        process.env.NODE_ENV === 'production'
          ? (process.env.PREVIEW ? pkg.reuters.preview : pkg.homepage) + 'cdn'
          : '',
      base:
        process.env.NODE_ENV === 'production'
          ? getRootRelativePath(
              process.env.PREVIEW ? pkg.reuters.preview : pkg.homepage
            )
          : '',
    },
    adapter: adapter({
      pages: 'dist',
      assets: 'dist/cdn',
      fallback: null,
    }),
    files: {
      assets: 'src/statics',
      lib: 'src/lib',
      routes: 'pages',
      template: 'src/template.html',
    },
    target: '#svelte-app',
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
        },
      },
      optimizeDeps: {
        exclude: ['svelte-fa', '@reuters-graphics/style-theme-eisbaer'],
        include: ['classnames', 'lodash-es', 'pym.js', 'ua-parser-js'],
      },
      plugins: [dsv(), svelteKitPagesPlugin()],
    },
  },
};

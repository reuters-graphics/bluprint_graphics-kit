const sveltePreprocess = require('svelte-preprocess');
const pkg = require('./package.json');
const url = require('url');
const path = require('path');
const dsv = require('@rollup/plugin-dsv');
const svelteKitPagesPlugin = require('./bin/svelte-kit/plugins/svelte-kit-pages/index.cjs');

const getRootRelativePath = (homepageURL) => {
  if (!homepageURL) return '';
  const page = new url.URL(homepageURL);
  return homepageURL.replace(`${page.protocol}//${page.host}`, '').replace(/\/$/, '');
};

module.exports = {
  preprocess: sveltePreprocess({
    preserve: ['ld+json'],
    scss: {
      includePaths: ['src/', 'node_modules/bootstrap/scss/'],
      importer: [
        (url) => {
          // Redirect tilde-prefixed imports to node_modules
          if (/^~/.test(url)) return { file: `node_modules/${url.replace('~', '')}` };
          return null;
        },
      ],
    },
    postcss: {
      plugins: [require('autoprefixer')],
    },
  }),
  kit: {
    appDir: '_app',
    paths: {
      assets: process.env.NODE_ENV === 'production' ? getRootRelativePath(process.env.PREVIEW ? pkg.reuters.preview : pkg.homepage) + '/cdn' : '',
      base: process.env.NODE_ENV === 'production' ? getRootRelativePath(process.env.PREVIEW ? pkg.reuters.preview : pkg.homepage) : '',
    },
    adapter: {
      name: 'static-adapter',
      async adapt(builder) {
        builder.copy_static_files('dist/cdn');
        builder.copy_client_files('dist/cdn');
        await builder.prerender({
          force: true,
          dest: 'dist',
        });
      },
    },
    files: {
      assets: 'src/statics',
      lib: 'src/lib',
      routes: 'pages',
      template: 'src/template.html',
    },
    target: '#svelte-app',
    vite: {
      build: { target: 'es2015' },
      resolve: {
        alias: {
          $utils: path.resolve(__dirname, 'src/utils'),
          $pkg: path.resolve(__dirname, 'package.json'),
          $imgs: path.resolve(__dirname, 'src/statics/images/manifest.json'),
          $locales: path.resolve(__dirname, 'locales'),
          'reuters-components': path.resolve(__dirname, 'src/FutureGraphicsComponentsLib'),
        },
      },
      optimizeDeps: {
        exclude: ['svelte-fa'],
        include: ['marked', 'lodash-es'],
      },
      plugins: [
        dsv(),
        svelteKitPagesPlugin(),
      ],
    },
  },
};

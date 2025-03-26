import adapter from '@sveltejs/adapter-static';
import autoprefixer from 'autoprefixer';
import { sveltePreprocess } from 'svelte-preprocess';
import { getBasePath } from '@reuters-graphics/graphics-kit-publisher';

const mode =
  process.env.TESTING ? 'test'
  : process.env.PREVIEW ? 'preview'
  : process.env.NODE_ENV === 'production' ? 'prod'
  : 'dev';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: sveltePreprocess({
    preserve: ['ld+json'],
    scss: { quietDeps: true, api: 'modern-compiler' },
    postcss: {
      plugins: [autoprefixer],
    },
  }),
  vitePlugin: {
    experimental: {
      disableSvelteResolveWarnings: true,
    },
  },
  kit: {
    appDir: '_app',
    paths: {
      assets: getBasePath(mode, 'cdn', {
        trailingSlash: false,
        rootRelative: false,
      }),
      base: getBasePath(mode, {
        trailingSlash: false,
        rootRelative: true,
      }),
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

import { purgeStyles } from '@reuters-graphics/vite-plugin-purge-styles';
import svelteKitPagesPlugin from './bin/svelte-kit/plugins/svelte-kit-pages/';
import { sveltekit } from '@sveltejs/kit/vite';
import { getBasePath } from '@reuters-graphics/graphics-kit-publisher';
import { defineConfig } from 'vitest/config';

// Keep in sync with the `mode` computation in svelte.config.js
const mode =
  process.env.TESTING ? 'test'
  : process.env.PREVIEW ? 'preview'
  : process.env.NODE_ENV === 'production' ? 'prod'
  : 'dev';

// Fully specified base URL for the page, exposed to the app as the global
// __BASE_URL__ (e.g. for the SEO component's baseUrl prop).
const baseUrl = getBasePath(mode, {
  trailingSlash: true,
  rootRelative: false,
});

export default defineConfig({
  define: {
    __BASE_URL__: JSON.stringify(baseUrl),
  },
  build: {
    target: 'es2015',
    sourcemap: true,
    // ponytail: cssTarget kept modern separately — es2015 CSS target makes Lightning CSS
    // drop grouped-selector branches (lightningcss#1260); @container queries need ~2022 anyway.
    cssTarget: ['chrome105', 'safari16', 'firefox110', 'edge105'],
  },
  optimizeDeps: {
    // ponytail: graphics-components' TileMap worker imports MapLibre's worker via
    // Vite's `?worker&url` recipe, which svelte-package copies into dist verbatim.
    // Vite 8's Rolldown pre-bundler reads that query as part of the filename and
    // hard-fails at dev-server startup (graphics-components#501, vitejs/vite#22943 —
    // fixed upstream for `vite build`, still open for dev/optimizeDeps). Excluding
    // maplibre-gl leaves the specifier for Vite's own transform pipeline, which
    // understands the query. Drop this once graphics-components#502 ships.
    exclude: ['maplibre-gl'],
  },
  server: {
    open: true,
    port: 3000,
    fs: {
      allow: ['.'],
    },
  },
  test: {
    fileParallelism: false,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      '.claude/**',
    ],
  },
  css: {
    preprocessorOptions: { scss: { quietDeps: true } },
  },
  plugins: [
    sveltekit(),
    svelteKitPagesPlugin(),
    purgeStyles({
      safeFiles: ['src/lib/styles/**/*.scss'],
    }),
  ],
});

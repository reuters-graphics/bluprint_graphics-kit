import { purgeStyles } from '@reuters-graphics/vite-plugin-purge-styles';
import svelteKitPagesPlugin from './bin/svelte-kit/plugins/svelte-kit-pages/';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    target: 'es2015',
    sourcemap: true,
    // ponytail: cssTarget kept modern separately — es2015 CSS target makes Lightning CSS
    // drop grouped-selector branches (lightningcss#1260); @container queries need ~2022 anyway.
    cssTarget: ['chrome105', 'safari16', 'firefox110', 'edge105'],
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

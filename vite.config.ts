import { purgeStyles } from '@reuters-graphics/vite-plugin-purge-styles';
import svelteKitPagesPlugin from './bin/svelte-kit/plugins/svelte-kit-pages/';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  build: { target: 'es2015', sourcemap: true },
  server: {
    open: true,
    port: 3000,
    fs: {
      allow: ['.'],
    },
  },
  test: {
    fileParallelism: false,
  },
  css: {
    preprocessorOptions: { scss: { quietDeps: true, api: 'modern-compiler' } },
  },
  plugins: [
    sveltekit(),
    svelteKitPagesPlugin(),
    purgeStyles({
      safeFiles: ['src/lib/styles/**/*.scss'],
    }),
  ],
});

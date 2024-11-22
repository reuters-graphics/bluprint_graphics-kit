import { purgeStyles } from '@reuters-graphics/vite-plugin-purge-styles';
import svelteKitPagesPlugin from './bin/svelte-kit/plugins/svelte-kit-pages/';
import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
  build: { target: 'es2015' },
  server: {
    open: true,
    port: 3000,
    fs: {
      allow: ['.'],
    },
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
};

export default config;

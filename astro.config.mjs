import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  outDir: './dist',
  srcDir: './docs',
  site: 'https://reuters-graphics.github.io',
  base: 'bluprint_graphics-kit',
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'Reuters graphics kit',
      customCss: ['./docs/assets/styles.css'],
      logo: {
        light: './docs/assets/logo-light.svg',
        dark: './docs/assets/logo-dark.svg',
        replacesTitle: true,
      },
      editLink: {
        baseUrl:
          'https://github.com/reuters-graphics/bluprint_graphics-kit/edit/main/',
      },
      favicon:
        'https://graphics.thomsonreuters.com/style-assets/images/logos/favicon/favicon.ico',
      social: {
        github: 'https://github.com/reuters-graphics/bluprint_graphics-kit/',
      },
    }),
  ],
});

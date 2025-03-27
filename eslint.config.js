import { svelte } from '@reuters-graphics/yaks-eslint';

/**
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  {
    files: [
      'bin/**/*.{js,ts}',
      'src/**/*.{js,ts,svelte}',
      'pages/**/*.{js,ts,svelte',
    ],
  },
  {
    ignores: [
      'node_modules/',
      'docs/',
      '.changeset/',
      '.svelte-kit/',
      '.astro/',
    ],
  },
  ...svelte,
  {
    rules: {
      'svelte3/unused-export-let': 'off',
    },
  },
];

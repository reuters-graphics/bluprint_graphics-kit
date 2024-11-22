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
  ...svelte,
  {
    rules: {
      'svelte3/unused-export-let': 'off',
    },
  },
];

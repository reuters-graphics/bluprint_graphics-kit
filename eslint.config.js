import { svelte } from '@reuters-graphics/yaks-eslint';
import mods from './bin/mods/eslint.config.js';

/**
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  {
    files: [
      'bin/**/*.{js,ts}',
      'src/**/*.{js,ts,svelte}',
      'pages/**/*.{js,ts,svelte}',
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
    languageOptions: {
      globals: {
        __BASE_URL__: 'readonly',
      },
    },
    rules: {
      'svelte3/unused-export-let': 'off',
    },
  },
  // Mod-specific overrides (kept in bin/mods/eslint.config.js). Last so it wins.
  ...mods,
];

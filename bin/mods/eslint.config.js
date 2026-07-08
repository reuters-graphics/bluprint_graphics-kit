/**
 * Nested ESLint config for the mods, composed into the root `eslint.config.js`
 * (flat config doesn't cascade from subdirectories, so the root spreads this in).
 *
 * Mod template dirs contain `$types.d.ts` stubs and ambient type mocks that
 * legitimately use `any` to stand in for SvelteKit-generated / post-transform
 * types, so the explicit-any rule is turned off for template files.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  {
    files: [
      'bin/mods/mods/*/templates/**/*.ts',
      'bin/mods/mods/*/templates/**/*.svelte',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];

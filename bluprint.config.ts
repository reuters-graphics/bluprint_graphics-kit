import {
  defineConfig,
  prompt,
  remove,
  move,
  regexreplace,
  json,
  execute,
  log,
} from '@reuters-graphics/bluprint';

interface Context {
  projectName: string;
  makeRngsDocs: boolean;
}

/**
 * v1 (`bluprint.config.ts`) config for the Graphics Kit.
 *
 * The legacy `.bluprintrc` is kept alongside this file so teammates on the
 * pre-1.0 CLI keep working; the v1 CLI reads only this file. `.bluprintrc` is
 * listed in `ignores` so it never lands in scaffolded projects.
 */
export default defineConfig<Context>({
  name: 'Graphics Kit',
  bluprint: '^1.0.0',
  files: ['**/*'],
  ignores: ['.bluprintrc'],
  actions: [
    prompt({
      name: 'projectName',
      type: 'text',
      message: 'What should we call this project?',
    }),

    remove([
      '.github/workflows/docs.yaml',
      '.github/workflows/release.yaml',
      '.github/workflows/test.yaml',
      '.github/workflows/update-dependencies.yaml',
      '.github/CODEOWNERS',
      '.github/COMMIT_ERROR_ISSUE_TEMPLATE.md',
      '.github/PULL_REQUEST_TEMPLATE.md',
      'test/**/*',
      'CHANGELOG.md',
      'CONTRIBUTING.md',
      'README.md',
      'rngs-io.json',
      'docs/**/*',
      'astro.config.mjs',
      '.changeset/*',
    ]),

    move([['PROJECT_README.md', 'README.md']]),

    regexreplace({
      files: ['package.json', 'README.md'],
      replace: [
        ['projectName', '{{# slugify }}{{ projectName }}{{ /slugify }}'],
        [
          '"@reuters-graphics/graphics-kit"',
          '"{{# slugify }}{{ projectName }}{{ /slugify }}"',
        ],
      ],
    }),

    // Drop the authoring-only bluprint dependency from the scaffolded project's
    // package.json (it's only here so this config type-checks while editing).
    json('package.json', (pkg: { devDependencies?: Record<string, string> }) => {
      if (pkg.devDependencies) delete pkg.devDependencies['@reuters-graphics/bluprint'];
      return pkg;
    }),

    execute(['git', 'init']),
    execute(['git', 'add', '.']),
    execute(['git', 'commit', '-m', 'initial']),
    execute('pnpm install', { silent: true }),
    execute(['pnpm', 'svelte-kit', 'sync']),
    execute(['npx', 'lefthook', 'install']),
    execute('pnpm startup:check-creds'),

    prompt({
      name: 'makeRngsDocs',
      type: 'confirm',
      message: 'Would you like to create a story in RNGS.io (usually, yes)?',
      initialValue: true,
    }),

    execute(
      "npx rngs-io stories new --name 'page-en' --template cltmvzj5m0000lc089jz22aet --syncPath 'locales/en/content.json'",
      { when: (ctx) => ctx.makeRngsDocs === true }
    ),
    execute(
      "npx rngs-io stories new --name 'embeds' --template cm8q3vr0e0000l803tfleu4t4 --syncPath 'locales/en/embeds.json'",
      { when: (ctx) => ctx.makeRngsDocs === true }
    ),
    execute('git add .', { when: (ctx) => ctx.makeRngsDocs === true }),
    execute('git commit -m "adds RNGS stories"', {
      when: (ctx) => ctx.makeRngsDocs === true,
    }),
    log(
      '\n{cyan RNGS.io} storyboard created at: {green https://www.rngs.io/storyboards/}\n',
      { when: (ctx) => ctx.makeRngsDocs === true }
    ),

    execute('pnpm stories:unconfig', {
      when: (ctx) => ctx.makeRngsDocs === false,
    }),

    execute('pnpm startup:create-repo'),

    log(
      '\n\n🏁 Finished creating your project, {cyan {{ projectName }}}!\n\nRun {green pnpm start} to begin developing.\n'
    ),
  ],
});

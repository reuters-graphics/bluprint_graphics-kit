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
      'CLAUDE.md',
      'CONTRIBUTING.md',
      'README.md',
      'rngs-io.json',
      'docs/**/*',
      'astro.config.mjs',
      '.changeset/*',
    ]),

    move([
      ['PROJECT_README.md', 'README.md'],
      ['PROJECT_CLAUDE.md', 'CLAUDE.md'],
    ]),

    regexreplace({
      files: ['package.json', 'README.md'],
      replace: [
        ['projectName', '{{#slugify}}{{ projectName }}{{/slugify}}'],
        [
          '"@reuters-graphics/graphics-kit"',
          '"{{#slugify}}{{ projectName }}{{/slugify}}"',
        ],
      ],
    }),

    // Drop devDependencies only needed in the bluprint
    json(
      'package.json',
      (pkg: { devDependencies?: Record<string, string> }) => {
        if (!pkg.devDependencies) return pkg;

        delete pkg.devDependencies['@astrojs/starlight'];
        delete pkg.devDependencies['@changesets/cli'];
        delete pkg.devDependencies['@reuters-graphics/bluprint'];
        delete pkg.devDependencies['astro'];

        return pkg;
      }
    ),

    execute(['git', 'init'], { silent: true }),
    execute('pnpm install', { silent: true, failOnError: true }),
    execute(['pnpm', 'svelte-kit', 'sync'], { silent: true }),
    execute(['npx', 'lefthook', 'install'], { silent: true }),
    execute('pnpm startup:check-creds'),
    execute('pnpm sync-llms', { silent: true }),
    execute(['git', 'add', '.'], { silent: true }),
    execute(['git', 'commit', '-m', 'initial'], { silent: true }),

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
    execute('git add .', {
      when: (ctx) => ctx.makeRngsDocs === true,
      silent: true,
    }),
    execute('git commit -m "adds RNGS stories"', {
      when: (ctx) => ctx.makeRngsDocs === true,
      silent: true,
    }),
    log(
      '\n{cyan RNGS.io} storyboard created at: {green https://www.rngs.io/storyboards/}\n',
      { when: (ctx) => ctx.makeRngsDocs === true }
    ),

    execute('pnpm stories:unconfig', {
      when: (ctx) => ctx.makeRngsDocs === false,
    }),

    execute('pnpm startup:create-repo'),

    // --- gfx workflow (temporary workaround for org default-branch protection) ---
    // See `.claude/context/git-workflow.md` in scaffolded projects for the why.
    // Normalize the local default branch to `main` (some devs' git defaults to `master`).
    execute(['git', 'branch', '-M', 'main'], { silent: true }),
    // Push `main` first so GitHub adopts it as the (protected) default branch.
    execute('git push -u origin main', { silent: true }),
    // Create + push the shared `gfx` working branch and leave the dev checked out on it.
    execute(['git', 'checkout', '-b', 'gfx'], { silent: true }),
    execute('git push -u origin gfx', { silent: true }),

    log(
      "\n\n🏁 Finished creating your project, {cyan {{ projectName }}}!\n\nYou're on the {cyan gfx} branch — push and pull to {cyan gfx}, not main.\n\nRun {green pnpm start} to begin developing.\n"
    ),
  ],
});

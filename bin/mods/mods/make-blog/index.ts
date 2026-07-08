import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import c from 'picocolors';
import { moduleDir } from '../../_core/dirname';
import { templateCopyOp } from '../../_core/template';
import { markerFile, hasMarker } from '../../_core/markers';
import type { ModContext } from '../../_core/context';
import type { FileOp } from '../../_core/plan';

const templatesDir = path.join(moduleDir(import.meta.url), 'templates');

// Stable RNGS.io story-template IDs for blog projects. Update here if they ever change.
const RNGS_BLOG_TEMPLATES = {
  mainPage: 'cluzadqcr0000l808fq116bs1', // → locales/en/content.json
  post: 'cluzaet6l0001l808jqznav5v', //      → locales/en/post-1.json
};

const ISBOT_VERSION = '^5.2.0';

const MARKER_NOTE = `This project was converted to a graphics blog by the make-blog mod.
It is a one-way change — the project-type mod no longer applies.
`;

/**
 * Rewrite `rngs-io.json` with every storyboard's `stories` emptied, keeping the
 * storyboards themselves (so the new blog stories can be grouped under them).
 * Returns `null` if there's no `rngs-io.json` to edit.
 */
const emptyStoriesContent = (root: string): string | null => {
  const file = path.join(root, 'rngs-io.json');
  if (!fs.existsSync(file)) return null;
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
  for (const board of Object.values(data.storyboards ?? {})) {
    (board as { stories?: unknown }).stories = {};
  }
  return `${JSON.stringify(data, null, 2)}\n`;
};

/** Phase A — deterministic, transactional scaffolding. */
const buildPlan = (root: string): FileOp[] => {
  const copy = (rel: string) => templateCopyOp(templatesDir, root, rel);
  const ops: FileOp[] = [
    copy('pages/+layout.svelte'),
    copy('pages/+layout.ts'),
    copy('pages/+page.svelte'),
    copy('pages/[date]/[slug]/+page.svelte'),
    copy('pages/[date]/[slug]/+page.ts'),
    copy('src/lib/Post.svelte'),
    copy('src/lib/post.ts'),
    // Placeholder content so the app builds/runs before RNGS.io sync (Phase B).
    // `stories:sync` overwrites these once the stories exist.
    copy('locales/en/content.json'),
    copy('locales/en/post-1.json'),
    { kind: 'remove', path: path.join(root, 'src/lib/App.svelte') },
    { kind: 'remove', path: path.join(root, 'pages/embeds/en/page') },
    { kind: 'remove', path: path.join(root, 'locales/en/embeds.json') },
    { kind: 'write', to: markerFile(root, 'blog'), content: MARKER_NOTE },
  ];

  const rngs = emptyStoriesContent(root);
  if (rngs) {
    ops.push({
      kind: 'write',
      to: path.join(root, 'rngs-io.json'),
      content: rngs,
    });
  }

  return ops;
};

/** Phase B commands — create the two RNGS.io stories, then sync their JSON down. */
const rngsCommands = [
  `npx rngs-io stories new --syncPath "locales/en/content.json" --name "Main page" --template ${RNGS_BLOG_TEMPLATES.mainPage}`,
  `npx rngs-io stories new --syncPath "locales/en/post-1.json" --name "Post 1" --template ${RNGS_BLOG_TEMPLATES.post}`,
  'pnpm stories:sync',
];

/** Phase B — best-effort RNGS.io wiring. Never rolls back Phase A. */
const runRngsSetup = (ctx: ModContext) => {
  try {
    for (const cmd of rngsCommands) {
      ctx.log.step(`Running: ${cmd}`);
      execSync(cmd, { cwd: ctx.root, stdio: 'inherit' });
    }
  } catch {
    ctx.log.error(
      'RNGS.io setup did not finish (offline or not authed?). Run these manually:'
    );
    for (const cmd of rngsCommands) ctx.log.message(`  ${cmd}`);
  }
};

export const makeBlog = async (
  ctx: ModContext,
  opts: { force?: boolean } = {}
) => {
  if (hasMarker(ctx.root, 'blog') && !opts.force) {
    ctx.log.error('This project has already been converted to a blog.');
    return;
  }

  if (!opts.force && !ctx.dryRun) {
    const confirmed = await ctx.confirm({
      message: `Convert this project into a graphics blog? This is a ${c.bold('one-way')} change.`,
    });
    if (!confirmed) return;
  }

  // Phase A — transactional scaffolding.
  ctx.apply(buildPlan(ctx.root));

  if (ctx.dryRun) {
    ctx.log.step('Would then create RNGS.io stories and sync content:');
    for (const cmd of rngsCommands) ctx.log.step(`  ${cmd}`);
    return;
  }

  // The permalink page uses isbot; add it as a real dependency.
  ctx.pkg().addDependency('isbot', ISBOT_VERSION);

  // Skip network work under test.
  if (process.env.TESTING) return;

  // Phase B — best-effort RNGS.io wiring.
  runRngsSetup(ctx);
};

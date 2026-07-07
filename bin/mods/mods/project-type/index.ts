import fs from 'fs';
import path from 'path';
import c from 'picocolors';
import { moduleDir } from '../../_core/dirname';
import type { ModContext } from '../../_core/context';
import type { FileOp } from '../../_core/plan';

const templatesDir = path.join(moduleDir(import.meta.url), 'templates');

type ProjectType = 'pages-plus' | 'embed-only';

const LABELS: Record<ProjectType, string> = {
  'pages-plus': 'pages + embeds',
  'embed-only': 'embeds-only',
};

/**
 * Detect the current project type from the project itself: a pages+ project has
 * a page embed, an embeds-only project doesn't. State lives in the project, not
 * in this package.
 */
const detectType = (root: string): ProjectType =>
  fs.existsSync(path.join(root, 'pages/embeds/en/page/+page.svelte')) ?
    'pages-plus'
  : 'embed-only';

/**
 * Build the file operations that convert a project to `target`. Both variants
 * are rendered from inert templates; the page embed is added or removed.
 */
const buildPlan = (target: ProjectType, root: string): FileOp[] => {
  const variant = path.join(templatesDir, target);
  const ops: FileOp[] = [
    {
      kind: 'copy',
      from: path.join(variant, '+page.svelte'),
      to: path.join(root, 'pages/+page.svelte'),
    },
    {
      kind: 'copy',
      from: path.join(variant, 'publisher.config.ts'),
      to: path.join(root, 'publisher.config.ts'),
    },
  ];

  if (target === 'pages-plus') {
    ops.push({
      kind: 'copy',
      from: path.join(variant, 'embeds/en/page/+page.svelte'),
      to: path.join(root, 'pages/embeds/en/page/+page.svelte'),
    });
  } else {
    ops.push({ kind: 'remove', path: path.join(root, 'pages/embeds/en/page') });
  }

  return ops;
};

export const changeProjectType = async (
  ctx: ModContext,
  opts: { force?: boolean } = {}
) => {
  const current = detectType(ctx.root);
  const target: ProjectType =
    current === 'pages-plus' ? 'embed-only' : 'pages-plus';

  if (!opts.force && !ctx.dryRun) {
    const confirmed = await ctx.confirm({
      message: `Change your project type from ${c.cyan(LABELS[current])} to ${c.cyan(LABELS[target])}? This overwrites the homepage, page embed and publisher config.`,
    });
    if (!confirmed) return;
  }

  ctx.apply(buildPlan(target, ctx.root));
};

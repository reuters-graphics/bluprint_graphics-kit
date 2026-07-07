import fs from 'fs';
import path from 'path';
import c from 'picocolors';
import dedent from 'dedent';
import { globSync } from 'glob';
import slugify from '@sindresorhus/slugify';
import { note } from '@reuters-graphics/clack';
import { moduleDir } from '../../_core/dirname';
import { LOCALES } from '../../_core/constants';
import type { ModContext } from '../../_core/context';

const templatesDir = path.join(moduleDir(import.meta.url), 'templates');

const promptForAiComponent = async (ctx: ModContext) => {
  const aiComponents = globSync('*.svelte', {
    cwd: path.join(ctx.root, 'src/lib/ai2svelte'),
    absolute: true,
  });
  return ctx.select({
    message:
      'Which of these ai2svelte components do you want to create an embed for?',
    options: aiComponents.map((filePath) => ({
      label: path.basename(filePath, '.svelte'),
      value: filePath,
    })),
  });
};

export const makeAiEmbed = async (
  ctx: ModContext,
  args: { aiComponent?: string; locale?: string } = {}
) => {
  const aiComponent = args.aiComponent ?? (await promptForAiComponent(ctx));
  const locale =
    args.locale ??
    (await ctx.select({
      message: "What's the language for this graphic embed?",
      initialValue: 'en',
      options: LOCALES,
    }));

  if (!fs.existsSync(aiComponent)) {
    ctx.log.error(`ai2svelte component not found: ${aiComponent}`);
    return;
  }

  const aiSlug = slugify(path.basename(aiComponent, '.svelte'));
  const pagesDir = path.join(ctx.root, 'pages/embeds', locale, aiSlug);
  const componentPath = path.join(pagesDir, '+page.svelte');

  if (fs.existsSync(componentPath)) {
    ctx.log.error('An embed already exists for this ai2svelte component');
    return;
  }

  ctx.apply([
    {
      kind: 'copy',
      from: path.join(templatesDir, '+page.svelte'),
      to: componentPath,
      replace: { 'ai-chart.svelte': path.basename(aiComponent) },
    },
    {
      kind: 'copy',
      from: path.join(templatesDir, '+page.server.ts'),
      to: path.join(pagesDir, '+page.server.ts'),
    },
  ]);

  if (!process.env.TESTING && !ctx.dryRun) {
    ctx.log.info(`Embed created: ${path.relative(ctx.root, componentPath)}`);
    note(dedent`Be sure to add this graphic to your ${c.cyan('"embeds"')} ArchieML
    doc and export AI statics for it before publishing.
    `);
  }
};

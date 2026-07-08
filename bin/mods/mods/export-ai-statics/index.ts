import path from 'path';
import { globSync } from 'glob';
import slugify from '@sindresorhus/slugify';
import { AiExport } from '@reuters-graphics/illustrator-exports';
import { LOCALES } from '../../_core/constants';
import type { ModContext } from '../../_core/context';

export const exportAiStatics = async (ctx: ModContext) => {
  const aiFiles = globSync('*.ai', {
    cwd: path.join(ctx.root, 'project-files'),
    absolute: true,
  });

  const aiFile = await ctx.select({
    message: 'Which AI file would you like to export assets for?',
    options: aiFiles.map((filePath) => ({
      label: path.basename(filePath, '.ai'),
      value: filePath,
    })),
  });

  const locale = await ctx.select({
    message: "What's the language for this graphic?",
    initialValue: 'en',
    options: LOCALES,
  });

  const aiSlug = slugify(path.basename(aiFile, '.ai'));
  const mediaJPG = path.join(
    ctx.root,
    'media-assets',
    locale,
    aiSlug,
    'graphic.jpg'
  );
  const mediaEPS = path.join(
    ctx.root,
    'media-assets',
    locale,
    aiSlug,
    'graphic.eps'
  );
  const staticsJPG = path.join(
    ctx.root,
    'src/statics/images/embeds',
    locale,
    `${aiSlug}.jpg`
  );

  const rel = (p: string) => path.relative(ctx.root, p);

  if (ctx.dryRun) {
    ctx.log.step('Planned exports (dry run — nothing written):');
    for (const p of [mediaEPS, mediaJPG, staticsJPG])
      ctx.log.step(`  · ${rel(p)}`);
    return;
  }

  const aiExport = new AiExport(aiFile);
  aiExport.saveEPS(mediaEPS, '-static');
  ctx.log.step(`Exported EPS: ${rel(mediaEPS)}`);
  aiExport.exportJPG(mediaJPG, '-static');
  ctx.log.step(`Exported JPG: ${rel(mediaJPG)}`);

  // Mirror the exported JPG into statics transactionally.
  ctx.apply([{ kind: 'copy', from: mediaJPG, to: staticsJPG }]);
};

import { cancel, isCancel, log, select } from '@clack/prompts';
import { utils } from '@reuters-graphics/graphics-bin';
import { AiExport } from '@reuters-graphics/illustrator-exports';
import { ROOT } from '../_utils/locations';
import fs from 'fs';
import { globSync } from 'glob';
import path from 'path';
import slugify from '@sindresorhus/slugify';

export const exportAiStatics = async () => {
  const aiFiles = globSync('*.ai', {
    cwd: path.join(ROOT, 'project-files'),
    absolute: true,
  });

  const aiFile = await select({
    message: 'Which AI file would you like to export assets for?',
    options: aiFiles.map((filePath) => ({
      label: path.basename(filePath, '.ai'),
      value: filePath,
    })),
  });
  if (isCancel(aiFile)) return cancel();

  const locale = await select({
    message: "What's the language for this graphic?",
    initialValue: 'en',
    options: [
      { value: 'en', label: 'English' },
      { value: 'ar', label: 'Arabic' },
      { value: 'fr', label: 'French' },
      { value: 'es', label: 'Spanish' },
      { value: 'de', label: 'German' },
      { value: 'it', label: 'Italian' },
      { value: 'ja', label: 'Japanese' },
      { value: 'pt', label: 'Portugese' },
      { value: 'ru', label: 'Russian' },
    ],
  });
  if (isCancel(locale)) return cancel();

  const aiSlug = slugify(path.basename(aiFile, '.ai'));
  const aiExport = new AiExport(aiFile);
  const mediaJPG = path.join(
    ROOT,
    'media-assets',
    locale,
    aiSlug,
    'graphic.jpg'
  );
  const mediaEPS = path.join(
    ROOT,
    'media-assets',
    locale,
    aiSlug,
    'graphic.eps'
  );
  const staticsJPG = path.join(
    ROOT,
    'src/statics/images/embeds/',
    locale,
    aiSlug + '.jpg'
  );
  aiExport.saveEPS(mediaEPS, '-static');
  log.step(`Exported EPS: ${path.relative(ROOT, mediaEPS)}`);
  aiExport.exportJPG(mediaJPG, '-static');
  log.step(`Exported JPG: ${path.relative(ROOT, mediaJPG)}`);
  utils.fs.ensureDir(staticsJPG);
  fs.copyFileSync(mediaJPG, staticsJPG);
  log.step(`Exported JPG: ${path.relative(ROOT, staticsJPG)}`);
};

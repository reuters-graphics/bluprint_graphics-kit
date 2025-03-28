import { globSync } from 'glob';
import path from 'path';
import fs from 'fs';
import { ROOT } from '../_utils/locations';
import { cancel, isCancel, log, select } from '@clack/prompts';
import slugify from '@sindresorhus/slugify';
import { utils } from '@reuters-graphics/graphics-bin';
import * as url from 'url';
import { note } from '@reuters-graphics/clack';
import dedent from 'dedent';
import c from 'picocolors';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const makeAiEmbed = async () => {
  const aiComponents = globSync('*.svelte', {
    cwd: path.join(ROOT, 'src/lib/ai2svelte'),
    absolute: true,
  });

  const aiComponent = await select({
    message:
      'Which of these ai2svelte components do you want to create an embed for?',
    options: aiComponents.map((filePath) => ({
      label: path.basename(filePath, '.svelte'),
      value: filePath,
    })),
  });
  if (isCancel(aiComponent)) return cancel();

  const locale = await select({
    message: "What's the language for this graphic embed?",
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

  const aiSlug = slugify(path.basename(aiComponent, '.svelte'));

  const pageDirectory = path.join(ROOT, 'pages/embeds', locale, aiSlug);
  const componentPath = path.join(pageDirectory, '+page.svelte');
  const loaderPath = path.join(pageDirectory, '+page.server.ts');

  if (fs.existsSync(componentPath)) {
    log.error('An embed already exists for this ai2svelte component');
    return;
  }
  utils.fs.ensureDir(componentPath);
  const templateString = fs.readFileSync(
    path.join(__dirname, 'templates/+page.svelte'),
    'utf-8'
  );
  const replacedString = templateString.replaceAll(
    'ai-graphic.svelte',
    path.basename(aiComponent)
  );
  fs.writeFileSync(componentPath, replacedString);
  fs.copyFileSync(
    path.join(__dirname, 'templates/+page.server.ts'),
    loaderPath
  );
  log.info(`Embed created: ${path.relative(ROOT, componentPath)}`);
  note(dedent`Be sure to add this graphic to your ${c.cyan('"embeds"')} ArchieML
    doc and export AI statics for it before publishing.
    `);
};

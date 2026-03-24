import fs from 'fs-extra';
import path from 'path';
import * as url from 'url';
import { execFileSync } from 'node:child_process';
import { cancel, confirm, isCancel } from '@clack/prompts';
import c from 'picocolors';
import { getLocations } from '../_utils/locations';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const templatesDir = path.join(__dirname, 'templates');

const createRngsIoStories = (cwd: string) => {
  const rngsConfigPath = path.join(cwd, 'rngs-io.json');

  // Start with a clean RNGS.io config so new stories are not merged with old IDs.
  if (fs.existsSync(rngsConfigPath)) {
    fs.writeFileSync(
      rngsConfigPath,
      JSON.stringify({ storyboards: {} }, null, 2)
    );
  }

  // Create a main page story and a post story using the blog template storyboards from RNGS.io.
  execFileSync(
    'npx',
    [
      'rngs-io',
      'stories',
      'new',
      '--name',
      'Main page',
      '--template',
      'clrkyrv3j0003jw084m0t3nd4',
      '--syncPath',
      'locales/en/content.json',
    ],
    { cwd, stdio: 'inherit' }
  );

  execFileSync(
    'npx',
    [
      'rngs-io',
      'stories',
      'new',
      '--name',
      'Post 1',
      '--template',
      'clrkyxy7b0005jw08dkrh4gpl',
      '--syncPath',
      'locales/en/post-1.json',
    ],
    { cwd, stdio: 'inherit' }
  );
};

const changeToBlogFormat = (createBlogRngsIoStories = true) => {
  const { ROOT } = getLocations();
  const pagesDir = path.join(ROOT, 'pages');
  const appPath = path.join(ROOT, 'src/lib/App.svelte');

  fs.cpSync(path.join(templatesDir, 'pages'), pagesDir, {
    recursive: true,
    force: true,
  });
  fs.cpSync(
    path.join(templatesDir, 'Post/index.svelte'),
    path.join(ROOT, 'src/lib/Post.svelte'),
    { force: true }
  );

  if (createBlogRngsIoStories) {
    createRngsIoStories(ROOT);
  }

  if (fs.existsSync(path.join(pagesDir, 'embeds')))
    fs.removeSync(path.join(pagesDir, 'embeds'));
  if (fs.existsSync(path.join(pagesDir, 'embed-previewer')))
    fs.removeSync(path.join(pagesDir, 'embed-previewer'));
  if (fs.existsSync(appPath)) fs.removeSync(appPath);
};

export const changeProjectTypeToBlog = async (
  force = false,
  createBlogRngsIoStories = true
) => {
  let shouldCreateBlogRngsIoStories = createBlogRngsIoStories;

  if (!force) {
    const confirmed = await confirm({
      message: `Are you sure you want to convert your project to ${c.cyan('blog format')}?`,
    });

    if (isCancel(confirmed) || !confirmed) return cancel();

    const createRngsIo = await confirm({
      message: 'Do you want to create new rngs.io stories now?',
      initialValue: true,
    });

    if (isCancel(createRngsIo)) return cancel();

    shouldCreateBlogRngsIoStories = !!createRngsIo;
  }

  changeToBlogFormat(shouldCreateBlogRngsIoStories);
};

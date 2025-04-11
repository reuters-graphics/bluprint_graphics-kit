import fs from 'fs';
import path from 'path';
import * as url from 'url';
import { cancel, confirm, isCancel } from '@clack/prompts';
import c from 'picocolors';
import { getLocations } from '../_utils/locations';
import { Mod } from '../_utils/mod';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const templateDirs = {
  embedsOnly: path.join(__dirname, 'templates/embed-only'),
  pagesPlus: path.join(__dirname, 'templates/page+embed'),
};

const mod = new Mod();

const changeToEmbedOnly = () => {
  const { ROOT } = getLocations();
  const pagesDir = path.join(ROOT, 'pages');

  mod.fs.swap(
    [templateDirs.embedsOnly, '+page.svelte'],
    [pagesDir, '+page.svelte'],
    [templateDirs.pagesPlus, '+page.svelte']
  );
  mod.fs.move(
    [pagesDir, 'embeds/en/page/+page.svelte'],
    [templateDirs.pagesPlus, 'embeds/en/page/+page.svelte']
  );
  mod.fs.swap(
    [templateDirs.embedsOnly, 'publisher.config.ts'],
    [ROOT, 'publisher.config.ts'],
    [templateDirs.pagesPlus, 'publisher.config.ts']
  );
};

const changeToPagesPlus = () => {
  const { ROOT } = getLocations();
  const pagesDir = path.join(ROOT, 'pages');

  mod.fs.swap(
    [templateDirs.pagesPlus, '+page.svelte'],
    [pagesDir, '+page.svelte'],
    [templateDirs.embedsOnly, '+page.svelte']
  );
  mod.fs.move(
    [templateDirs.pagesPlus, 'embeds/en/page/+page.svelte'],
    [pagesDir, 'embeds/en/page/+page.svelte']
  );
  mod.fs.swap(
    [templateDirs.pagesPlus, 'publisher.config.ts'],
    [ROOT, 'publisher.config.ts'],
    [templateDirs.embedsOnly, 'publisher.config.ts']
  );
};

export const changeProjectType = async (force = false) => {
  const isEmbedOnly = fs.existsSync(
    path.join(templateDirs.pagesPlus, '+page.svelte')
  );
  const typeLabel = isEmbedOnly ? 'pages + embeds' : 'embeds-only';

  if (!force) {
    const confirmed = await confirm({
      message: `Are you sure you want to change your project type to ${c.cyan(typeLabel)}?`,
    });

    if (isCancel(confirmed) || !confirmed) return cancel();
  }

  if (isEmbedOnly) {
    changeToPagesPlus();
  } else {
    changeToEmbedOnly();
  }
};

import fs from 'fs';
import path from 'path';
import * as url from 'url';
import { cancel, confirm, isCancel } from '@clack/prompts';
import c from 'picocolors';
import { ROOT } from '../_utils/locations';
import { swap } from './utils/swap';

const pagesDir = path.join(ROOT, 'pages');
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const templatesDir = path.join(__dirname, 'templates');
const pagePlusTemplates = path.join(templatesDir, 'page+embed');
const embedTemplates = path.join(templatesDir, 'embed-only');

const changeToEmbedOnly = () => {
  swap(
    [embedTemplates, '+page.svelte'],
    [pagesDir, '+page.svelte'],
    [pagePlusTemplates, '+page.svelte']
  );
  swap(
    [],
    [pagesDir, 'embeds/en/page/+page.svelte'],
    [pagePlusTemplates, 'embeds/en/page/+page.svelte']
  );
  swap(
    [embedTemplates, 'publisher.config.ts'],
    [ROOT, 'publisher.config.ts'],
    [pagePlusTemplates, 'publisher.config.ts']
  );
};

const changeToPagesPlus = () => {
  swap(
    [pagePlusTemplates, '+page.svelte'],
    [pagesDir, '+page.svelte'],
    [embedTemplates, '+page.svelte']
  );
  swap(
    [pagePlusTemplates, 'embeds/en/page/+page.svelte'],
    [pagesDir, 'embeds/en/page/+page.svelte'],
    []
  );
  swap(
    [pagePlusTemplates, 'publisher.config.ts'],
    [ROOT, 'publisher.config.ts'],
    [embedTemplates, 'publisher.config.ts']
  );
};

export const changeProjectType = async (force = false) => {
  const isEmbedOnly = fs.existsSync(
    path.join(pagePlusTemplates, '+page.svelte')
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

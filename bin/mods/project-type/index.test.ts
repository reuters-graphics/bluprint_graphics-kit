import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import { TestWorkingDirectory } from '$test/utils/twd';
import { changeProjectType } from '.';
import fs from 'fs';
import path from 'path';
import * as url from 'url';
import { execSync } from 'child_process';

const twd = new TestWorkingDirectory();

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const templatesDir = path.join(__dirname, 'templates');
const pagePlusTemplates = path.join(templatesDir, 'page+embed');
const embedTemplates = path.join(templatesDir, 'embed-only');

beforeAll(async () => {
  await twd.setup();
});

afterAll(async () => {
  await twd.cleanup();
});

describe('Mods: project-type', () => {
  it('should change project type to embeds-only', async () => {
    await changeProjectType(true);
    // Removes page embed
    expect(
      fs.existsSync(path.join(twd.TWD, 'pages/embeds/en/page/+page.svelte'))
    ).toBe(false);
    // Rewrites homepage
    expect(
      fs.readFileSync(path.join(twd.TWD, 'pages/+page.svelte'), 'utf8')
    ).toMatch('<meta name="robots" content="noindex, nofollow" />');
    // Rewrites publisher config
    expect(
      fs.readFileSync(path.join(twd.TWD, 'publisher.config.ts'), 'utf8')
    ).toMatch('locales/en/embeds.json?story.authors');
    // Archives pages+ templates
    expect(fs.existsSync(path.join(pagePlusTemplates, '+page.svelte'))).toBe(
      true
    );
    expect(
      fs.existsSync(path.join(pagePlusTemplates, 'embeds/en/page/+page.svelte'))
    ).toBe(true);
  });

  it('should build embeds-only pages', async () => {
    try {
      execSync('vite build');
    } catch {
      expect(false).toBe(true);
    }
    expect(true).toBe(true);

    expect(fs.existsSync(path.join(twd.TWD, 'dist/index.html'))).toBe(true);
    expect(
      fs.existsSync(path.join(twd.TWD, 'dist/embeds/en/page/index.html'))
    ).toBe(false);
  }, 30_000);

  it('should change project type back to pages+', async () => {
    await changeProjectType(true);

    // Brings back page embed
    expect(
      fs.existsSync(path.join(twd.TWD, 'pages/embeds/en/page/+page.svelte'))
    ).toBe(true);

    // Archives embeds+ template
    expect(fs.existsSync(path.join(embedTemplates, '+page.svelte'))).toBe(true);
    expect(
      fs.existsSync(path.join(embedTemplates, 'publisher.config.ts'))
    ).toBe(true);

    // Removes pages+ templates
    expect(fs.existsSync(path.join(pagePlusTemplates, '+page.svelte'))).toBe(
      false
    );
    expect(
      fs.existsSync(path.join(pagePlusTemplates, 'embeds/en/page/+page.svelte'))
    ).toBe(false);

    // Rewrites homepage
    expect(
      fs.readFileSync(path.join(twd.TWD, 'pages/+page.svelte'), 'utf8')
    ).not.toMatch('<meta name="robots" content="noindex, nofollow" />');
    // Rewrites publisher config
    expect(
      fs.readFileSync(path.join(twd.TWD, 'publisher.config.ts'), 'utf8')
    ).toMatch('locales/en/content.json?story.seoTitle');
  });

  it('should build pages+ pages', async () => {
    try {
      execSync('vite build');
    } catch {
      expect(false).toBe(true);
    }
    expect(true).toBe(true);

    expect(fs.existsSync(path.join(twd.TWD, 'dist/index.html'))).toBe(true);
    expect(
      fs.existsSync(path.join(twd.TWD, 'dist/embeds/en/page/index.html'))
    ).toBe(true);
  }, 30_000);
});

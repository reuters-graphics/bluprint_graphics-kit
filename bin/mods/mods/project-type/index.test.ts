import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import { TestWorkingDirectory } from '$test/utils/twd';
import { createTestContext } from '$test/utils/modContext';
import { changeProjectType } from '.';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';

process.env.TESTING = 'true';

const twd = new TestWorkingDirectory();

describe('Mods: project-type', () => {
  beforeAll(async () => {
    await twd.setup();
  });

  afterAll(async () => {
    await twd.cleanup();
  });

  it('should change project type to embeds-only', async () => {
    await changeProjectType(createTestContext(twd.TWD), { force: true });
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
    await changeProjectType(createTestContext(twd.TWD), { force: true });

    // Brings back page embed
    expect(
      fs.existsSync(path.join(twd.TWD, 'pages/embeds/en/page/+page.svelte'))
    ).toBe(true);
    // Rewrites homepage
    expect(
      fs.readFileSync(path.join(twd.TWD, 'pages/+page.svelte'), 'utf8')
    ).not.toMatch('<meta name="robots" content="noindex, nofollow" />');
    // Rewrites publisher config
    expect(
      fs.readFileSync(path.join(twd.TWD, 'publisher.config.ts'), 'utf8')
    ).toMatch('locales/en/content.json?story.seoTitle');
  });

  it('dry run reports without changing files', async () => {
    const before = fs.readFileSync(
      path.join(twd.TWD, 'pages/+page.svelte'),
      'utf8'
    );
    await changeProjectType(createTestContext(twd.TWD, [], { dryRun: true }), {
      force: true,
    });
    expect(
      fs.existsSync(path.join(twd.TWD, 'pages/embeds/en/page/+page.svelte'))
    ).toBe(true);
    expect(
      fs.readFileSync(path.join(twd.TWD, 'pages/+page.svelte'), 'utf8')
    ).toBe(before);
  });

  it('should build pages+ pages', async () => {
    await fs.remove(path.join(twd.TWD, 'dist'));
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

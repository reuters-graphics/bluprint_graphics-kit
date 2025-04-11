import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import { TestWorkingDirectory } from '$test/utils/twd';
import fs from 'fs';
import path from 'path';
import { makeAiEmbed } from '.';
import { execSync } from 'child_process';

process.env.TESTING = 'true';

const twd = new TestWorkingDirectory();

describe('Mods: make-ai-embed', () => {
  beforeAll(async () => {
    await twd.setup();
  });

  afterAll(async () => {
    await twd.cleanup();
  });

  it('should make embed source page', async () => {
    const aiComponent = path.join(twd.TWD, 'src/lib/ai2svelte/map.svelte');
    fs.copyFileSync(
      path.join(twd.TWD, 'src/lib/ai2svelte/ai-chart.svelte'),
      aiComponent
    );

    await makeAiEmbed(aiComponent, 'en');

    expect(
      fs.existsSync(path.join(twd.TWD, 'pages/embeds/en/map/+page.svelte'))
    ).toBe(true);
    expect(
      fs.existsSync(path.join(twd.TWD, 'pages/embeds/en/map/+page.server.ts'))
    ).toBe(true);
    const pageContent = fs.readFileSync(
      path.join(twd.TWD, 'pages/embeds/en/map/+page.svelte'),
      'utf-8'
    );
    expect(pageContent).toMatch(
      `import Graphic from '$lib/ai2svelte/map.svelte';`
    );
  });

  it('should build the app without error', async () => {
    try {
      execSync('vite build');
    } catch {
      expect(false).toBe(true);
    }
    expect(true).toBe(true);

    expect(
      fs.existsSync(path.join(twd.TWD, 'dist/embeds/en/map/index.html'))
    ).toBe(true);
    expect(
      fs.existsSync(path.join(twd.TWD, 'dist/embeds/en/page/index.html'))
    ).toBe(true);
    expect(fs.existsSync(path.join(twd.TWD, 'dist/index.html'))).toBe(true);
  }, 30_000);
});

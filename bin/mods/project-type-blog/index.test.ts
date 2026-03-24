import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import { TestWorkingDirectory } from '$test/utils/twd';
import { changeProjectTypeToBlog } from '.';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';

process.env.TESTING = 'true';

const twd = new TestWorkingDirectory();

describe('Mods: project-type-blog', () => {
  beforeAll(async () => {
    await twd.setup();
  });

  afterAll(async () => {
    await twd.cleanup();
  });

  it('converts the project pages to blog format', async () => {
    await changeProjectTypeToBlog(true, false);

    expect(fs.existsSync(path.join(twd.TWD, 'pages/+layout.svelte'))).toBe(
      true
    );
    expect(
      fs.existsSync(path.join(twd.TWD, 'pages/[date]/[slug]/+page.svelte'))
    ).toBe(true);
    expect(
      fs.existsSync(path.join(twd.TWD, 'pages/[date]/[slug]/+page.ts'))
    ).toBe(true);
    expect(fs.existsSync(path.join(twd.TWD, 'pages/embeds'))).toBe(false);
  });

  it('replaces App.svelte with blog Post.svelte', async () => {
    expect(fs.existsSync(path.join(twd.TWD, 'src/lib/App.svelte'))).toBe(false);
    expect(fs.existsSync(path.join(twd.TWD, 'src/lib/Post.svelte'))).toBe(true);
    expect(
      fs.readFileSync(path.join(twd.TWD, 'src/lib/Post.svelte'), 'utf8')
    ).toMatch('<BlogPost');
  });

  it('keeps rngs-io.json in force mode', async () => {
    const rngsIoJson = fs.readFileSync(
      path.join(twd.TWD, 'rngs-io.json'),
      'utf8'
    );
    expect(rngsIoJson).toMatch('cltmvxt5q0000l908irus4rdd');
  });

  it('builds after conversion', async () => {
    // Create a dummy post JSON file to ensure there is content to build.
    const postPath = path.join(twd.TWD, 'locales/en/post-1.json');
    await fs.ensureDir(path.dirname(postPath));
    await fs.writeJson(postPath, {
      story: {
        title: 'Test post 1',
        slugTitle: 'Test post 1',
        seoTitle: 'Test post 1',
        seoDescription: 'This is a test post.',
        shareTitle: 'Test post 1',
        shareDescription: 'This is a test post.',
        shareImgPath: 'images/reuters-graphics.jpg',
        shareImgAlt: 'A share image for test post 1.',
        publishedDate: '2026-03-01T10:27:00.000Z',
        updatedDate: '2026-03-01T10:27:00.000Z',
        authors: ['Test Author'],
        blocks: [{ type: 'text', text: 'Dummy post content.' }],
      },
    });

    try {
      execSync('vite build');
    } catch {
      expect(false).toBe(true);
    }

    expect(fs.existsSync(path.join(twd.TWD, 'dist/index.html'))).toBe(true);
  }, 30_000);
});

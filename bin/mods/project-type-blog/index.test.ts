import { describe, it, beforeAll, afterAll, expect, vi } from 'vitest';
import { TestWorkingDirectory } from '$test/utils/twd';
import { changeProjectTypeToBlog } from '.';
import fs from 'fs-extra';
import path from 'path';
import { execSync, execFileSync } from 'node:child_process';

vi.mock('node:child_process', async () => {
  const actual = (await vi.importActual(
    'node:child_process'
  )) as typeof import('node:child_process');

  return {
    ...actual,
    execFileSync: vi.fn(() => Buffer.from('')),
  };
});

process.env.TESTING = 'true';

const twd = new TestWorkingDirectory();
const execFileSyncMock = vi.mocked(execFileSync);

describe('Mods: project-type-blog', () => {
  beforeAll(async () => {
    await twd.setup();
  });

  afterAll(async () => {
    await twd.cleanup();
  });

  it('converts the project pages to blog format', async () => {
    await changeProjectTypeToBlog(true);

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

  it('creates new rngs-io docs in force mode', async () => {
    const rngsIoJson = fs.readFileSync(
      path.join(twd.TWD, 'rngs-io.json'),
      'utf8'
    );
    expect(rngsIoJson).toMatch('{\n  "storyboards": {}\n}');
    expect(execFileSyncMock).toHaveBeenCalledTimes(2);
    expect(execFileSyncMock).toHaveBeenNthCalledWith(
      1,
      'npx',
      expect.arrayContaining([
        'rngs-io',
        'stories',
        'new',
        '--name',
        'Main page',
        '--template',
        'clrkyrv3j0003jw084m0t3nd4',
      ]),
      expect.objectContaining({ cwd: twd.TWD })
    );
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

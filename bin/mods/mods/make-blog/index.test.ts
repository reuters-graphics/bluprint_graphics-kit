import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import { TestWorkingDirectory } from '$test/utils/twd';
import { createTestContext } from '$test/utils/modContext';
import { makeBlog } from '.';
import { changeProjectType } from '../project-type';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';

process.env.TESTING = 'true';

const twd = new TestWorkingDirectory();

// Simulates what `stories:sync` produces after the mod creates the RNGS stories.
const CONTENT_SHELL = {
  metadata: { id: 'main', name: 'Main page' },
  story: {
    seoTitle: 'A Reuters Graphics blog',
    seoDescription: 'A blog.',
    shareTitle: 'A Reuters Graphics blog',
    shareDescription: 'A blog.',
    shareImgPath: 'images/reuters-graphics.jpg',
    shareImgAlt: 'Share image.',
    section: 'Graphics',
    mainHeadline: 'A Reuters Graphics blog',
    endNotes: [{ title: 'Edited by', text: 'Editor' }],
  },
};

const POST_1 = {
  metadata: { id: 'post-1', name: 'Post 1' },
  story: {
    title: 'My first post',
    slugTitle: 'my-first-post',
    seoTitle: 'My first post',
    seoDescription: 'The first post.',
    shareTitle: 'My first post',
    shareDescription: 'The first post.',
    shareImgPath: 'images/reuters-graphics.jpg',
    shareImgAlt: 'Share image.',
    authors: ['Jane Doe'],
    publishedDate: '2026-01-15T10:00:00.000Z',
    updatedDate: '',
    blocks: [{ type: 'text', text: 'Hello, world.' }],
  },
};

describe('Mods: make-blog', () => {
  beforeAll(async () => {
    await twd.setup();
  });

  afterAll(async () => {
    await twd.cleanup();
  });

  it('scaffolds the blog structure', async () => {
    await makeBlog(createTestContext(twd.TWD), { force: true });
    const T = twd.TWD;

    // New blog routes + component
    expect(fs.existsSync(path.join(T, 'pages/[date]/[slug]/+page.ts'))).toBe(
      true
    );
    expect(
      fs.existsSync(path.join(T, 'pages/[date]/[slug]/+page.svelte'))
    ).toBe(true);
    expect(fs.existsSync(path.join(T, 'src/lib/Post.svelte'))).toBe(true);
    expect(fs.existsSync(path.join(T, 'src/lib/post.ts'))).toBe(true);

    // Removed: single-page app + embed
    expect(fs.existsSync(path.join(T, 'src/lib/App.svelte'))).toBe(false);
    expect(fs.existsSync(path.join(T, 'pages/embeds/en/page'))).toBe(false);
    expect(fs.existsSync(path.join(T, 'locales/en/embeds.json'))).toBe(false);

    // One-way marker
    expect(fs.existsSync(path.join(T, 'bin/mods/.converted-to-blog'))).toBe(
      true
    );

    // rngs-io.json: stories emptied, storyboard kept
    const rngs = fs.readJsonSync(path.join(T, 'rngs-io.json'));
    const boards = Object.values(rngs.storyboards) as { stories: object }[];
    expect(boards.length).toBeGreaterThan(0);
    for (const board of boards) expect(board.stories).toEqual({});

    // isbot added as a real dependency
    const pkg = fs.readJsonSync(path.join(T, 'package.json'));
    expect(pkg.dependencies.isbot).toBeTruthy();
  });

  it('is a one-way trip', async () => {
    const T = twd.TWD;
    // project-type refuses (marker present) — no page embed gets re-created
    await changeProjectType(createTestContext(T), { force: true });
    expect(
      fs.existsSync(path.join(T, 'pages/embeds/en/page/+page.svelte'))
    ).toBe(false);
    // make-blog refuses to re-run without --force — App stays gone, nothing restored
    await makeBlog(createTestContext(T));
    expect(fs.existsSync(path.join(T, 'src/lib/App.svelte'))).toBe(false);
  });

  it('builds the blog with synced content', async () => {
    const T = twd.TWD;
    // Stand in for `stories:sync` output.
    fs.writeJsonSync(path.join(T, 'locales/en/content.json'), CONTENT_SHELL, {
      spaces: 2,
    });
    fs.writeJsonSync(path.join(T, 'locales/en/post-1.json'), POST_1, {
      spaces: 2,
    });

    try {
      execSync('vite build');
    } catch {
      expect(false).toBe(true);
    }

    expect(fs.existsSync(path.join(T, 'dist/index.html'))).toBe(true);
    // The starter post's prerendered permalink (proves glob + crawler-link mechanism)
    expect(
      fs.existsSync(path.join(T, 'dist/2026-01-15/my-first-post/index.html'))
    ).toBe(true);
  }, 40_000);
});

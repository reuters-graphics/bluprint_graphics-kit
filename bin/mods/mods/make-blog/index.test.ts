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

    // Placeholder content so the app works before RNGS.io sync
    expect(fs.existsSync(path.join(T, 'locales/en/post-1.json'))).toBe(true);
    const content = fs.readJsonSync(path.join(T, 'locales/en/content.json'));
    expect(content.story.mainHeadline).toBeTruthy();

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

  it('builds the blog from its placeholder content', async () => {
    const T = twd.TWD;
    // No fixtures needed — the mod already wrote content.json + post-1.json.
    try {
      execSync('vite build');
    } catch {
      expect(false).toBe(true);
    }

    expect(fs.existsSync(path.join(T, 'dist/index.html'))).toBe(true);
    // The placeholder post's prerendered permalink: <publishedDate>/<slugified slugTitle>
    // (proves glob + crawler-link mechanism)
    expect(
      fs.existsSync(path.join(T, 'dist/2026-04-09/title-for-post/index.html'))
    ).toBe(true);
  }, 40_000);
});

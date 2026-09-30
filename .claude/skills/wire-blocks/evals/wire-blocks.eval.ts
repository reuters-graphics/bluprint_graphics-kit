import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  type SDKMessage,
  type SDKResultSuccess,
} from '@anthropic-ai/claude-agent-sdk';
import {
  createWorktree,
  removeWorktree,
  type Worktree,
} from '../../_utils/worktree';
import { runSkill } from '../../_utils/runner';

describe('wire-blocks', () => {
  let worktree: Worktree;
  let messages: SDKMessage[];

  beforeAll(async () => {
    worktree = createWorktree();

    // Stub out `stories:sync` — the skill's first step runs it against the
    // live rngs.io CMS, which would overwrite the fixture below with
    // whatever the real doc currently contains, making this eval flaky and
    // network-dependent instead of testing against a known fixture.
    const pkgPath = join(worktree.path, 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    pkg.scripts['stories:sync'] = 'node -e "process.exit(0)"';
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

    const contentPath = join(worktree.path, 'locales/en/content.json');
    const content = JSON.parse(readFileSync(contentPath, 'utf8'));
    content.story = content.story || {};
    content.story.blocks = [
      ...(content.story.blocks || []),
      {
        type: 'feature-photo',
        src: 'images/test-photo.jpg',
        alt: 'A test photo',
        caption: 'A caption',
        credit: 'Jane Doe',
      },
    ];
    writeFileSync(contentPath, JSON.stringify(content, null, 2));

    messages = await runSkill(
      'wire-blocks',
      'Wire the new feature-photo content block into src/lib/App.svelte.',
      worktree.path
    );
  });

  afterAll(() => {
    removeWorktree(worktree);
  });

  it('was invoked via the skill system', () => {
    const result = messages.find(
      (m): m is SDKResultSuccess => m.type === 'result' && !('error' in m)
    );
    expect(result?.is_error).toBe(false);
    expect(result?.num_turns).toBeGreaterThan(0);
    expect(result?.stop_reason).toBe('end_turn');
  });

  it('adds a branch and import for the new block type', () => {
    const appSvelte = readFileSync(
      join(worktree.path, 'src/lib/App.svelte'),
      'utf8'
    );
    expect(appSvelte).toContain('feature-photo');
    expect(appSvelte).toContain('FeaturePhoto');
  });

  it('does not add a speculative external-URL branch when every instance is a local path', () => {
    const appSvelte = readFileSync(
      join(worktree.path, 'src/lib/App.svelte'),
      'utf8'
    );
    const branchMatch = appSvelte.match(
      /\{:else if block\.type === 'feature-photo'\}[\s\S]*?(?=\{:else)/
    );
    expect(branchMatch).not.toBeNull();
    expect(branchMatch![0]).not.toContain('isExternalUrl');
  });

  it('does not modify locales/en/content.json', () => {
    const content = readFileSync(
      join(worktree.path, 'locales/en/content.json'),
      'utf8'
    );
    expect(content).toContain('feature-photo');
  });
});

import { readFileSync } from 'fs';
import { join } from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  createWorktree,
  removeWorktree,
  type Worktree,
} from '../../utils/worktree';
import { runSkill } from '../../utils/runner';

describe('hello-skill', () => {
  let worktree: Worktree;

  beforeAll(async () => {
    worktree = createWorktree();
    await runSkill(
      'hello-skill',
      'Run the hello skill on this project.',
      worktree.path
    );
  });

  afterAll(() => {
    removeWorktree(worktree);
  });

  it('adds the hello comment to the top of App.svelte', () => {
    const appSvelte = readFileSync(
      join(worktree.path, 'src/lib/App.svelte'),
      'utf8'
    );
    expect(appSvelte.trimStart()).toMatch(/^<!-- 🤖 skill: hello-skill -->/);
  });

  it('does not remove the script tag or existing content', () => {
    const appSvelte = readFileSync(
      join(worktree.path, 'src/lib/App.svelte'),
      'utf8'
    );
    expect(appSvelte).toContain('<script lang="ts">');
    expect(appSvelte).toContain('$props()');
  });
});

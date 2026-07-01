import { readFileSync } from 'fs';
import { join } from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  type SDKAssistantMessage,
  type SDKMessage,
  type SDKResultSuccess,
} from '@anthropic-ai/claude-agent-sdk';
import {
  createWorktree,
  removeWorktree,
  type Worktree,
} from '../../_utils/worktree';
import { runSkill } from '../../_utils/runner';

describe('hello-skill', () => {
  let worktree: Worktree;
  let messages: SDKMessage[];

  beforeAll(async () => {
    worktree = createWorktree();
    messages = await runSkill(
      'hello-skill',
      'Run the hello skill on this project.',
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
    expect(result).toBeDefined();
    expect(result?.is_error).toBe(false);
    expect(result?.num_turns).toBeGreaterThan(0);
    expect(result?.stop_reason).toBe('end_turn');
  });

  it('used the Edit tool to add the hello-skill comment', () => {
    const editCall = messages
      .filter((m): m is SDKAssistantMessage => m.type === 'assistant')
      .flatMap((m) => m.message.content)
      .find(
        (b) =>
          b.type === 'tool_use' &&
          b.name === 'Edit' &&
          typeof (b.input as Record<string, unknown>).new_string === 'string' &&
          ((b.input as Record<string, unknown>).new_string as string).includes(
            'hello-skill'
          )
      );
    expect(editCall).toBeDefined();
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

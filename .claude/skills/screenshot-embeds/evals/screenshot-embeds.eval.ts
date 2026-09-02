import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
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

describe('screenshot-embeds', () => {
  let worktree: Worktree;
  let messages: SDKMessage[];

  beforeAll(async () => {
    worktree = createWorktree();

    const embedDir = join(worktree.path, 'pages/embeds/en/test-map');
    mkdirSync(embedDir, { recursive: true });
    writeFileSync(
      join(embedDir, '+page.svelte'),
      `<script lang="ts">
  import { asset } from '$app/paths';
  import { page } from '$app/state';
  import { PymChild, SEO } from '@reuters-graphics/graphics-components';
</script>

<SEO
  baseUrl={__BASE_URL__}
  pageUrl={page.url}
  shareImgPath={asset('/images/reuters-graphics.jpg')}
/>

<h1>Test map</h1>
<PymChild polling={500} />
`
    );

    messages = await runSkill(
      'screenshot-embeds',
      'Update embed share image metadata for the test-map embed. Do not run the screenshot script; assume src/statics/images/embeds/en/test-map.png already exists and only update the Svelte metadata.',
      worktree.path
    );
  }, 300_000);

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

  it('read project context before editing metadata', () => {
    const readCalls = messages
      .filter((m): m is SDKAssistantMessage => m.type === 'assistant')
      .flatMap((m) => m.message.content)
      .filter((b) => b.type === 'tool_use' && b.name === 'Read')
      .map((b) => String((b.input as Record<string, unknown>).file_path));

    expect(
      readCalls.some((path) => path.endsWith('.claude/context/routing.md'))
    ).toBe(true);
    expect(
      readCalls.some((path) => path.endsWith('.claude/context/assets.md'))
    ).toBe(true);
  });

  it('updates placeholder embed share image metadata', () => {
    const svelte = readFileSync(
      join(worktree.path, 'pages/embeds/en/test-map/+page.svelte'),
      'utf8'
    );

    expect(svelte).toContain("asset('/images/embeds/en/test-map.png')");
    expect(svelte).toContain('shareImgWidth={1200}');
    expect(svelte).toContain('shareImgHeight={628}');
    expect(svelte).not.toContain("asset('/images/reuters-graphics.jpg')");
  });

  it('keeps the screenshot script bundled with the skill', () => {
    expect(
      existsSync(
        join(
          worktree.path,
          '.claude/skills/screenshot-embeds/scripts/screenshot.mjs'
        )
      )
    ).toBe(true);
  });
});

import { existsSync, readFileSync } from 'fs';
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

// ── Guard: rejects overwriting an existing skill ──────────────────────────────

describe('write-skill / guard: rejects existing skill', () => {
  let worktree: Worktree;
  let messages: SDKMessage[];

  beforeAll(async () => {
    worktree = createWorktree();
    // Attempt to write a skill that already exists in the repo
    messages = await runSkill('write-skill', 'write-skill', worktree.path);
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

  it('tells the user the skill already exists', () => {
    const result = messages.find(
      (m): m is SDKResultSuccess => m.type === 'result' && !('error' in m)
    );
    expect(result?.result.toLowerCase()).toMatch(/already exists/);
  });

  it('does not overwrite the existing SKILL.md', () => {
    const skillMd = readFileSync(
      join(worktree.path, '.claude/skills/write-skill/SKILL.md'),
      'utf8'
    );
    // The original write-skill SKILL.md should still contain its own name in
    // the frontmatter — proof it was not replaced with generated content
    expect(skillMd).toContain('name: write-skill');
  });
});

// ── Success: creates new skill from a description ─────────────────────────────

// A distinctive marker embedded in the skill description. If the generated
// SKILL.md contains this string, the skill genuinely used the description
// rather than producing a generic template.
const MARKER = 'SKILL_EVAL_MARKER';
const TEST_SKILL = 'test-marker-skill';

describe('write-skill / success: creates skill from description', () => {
  let worktree: Worktree;
  let messages: SDKMessage[];

  beforeAll(async () => {
    worktree = createWorktree();
    messages = await runSkill(
      'write-skill',
      `${TEST_SKILL} A skill that adds the HTML comment <!-- ${MARKER} --> to the top of any Svelte file it edits`,
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

  it('creates SKILL.md at the correct path', () => {
    expect(
      existsSync(join(worktree.path, `.claude/skills/${TEST_SKILL}/SKILL.md`))
    ).toBe(true);
  });

  it('SKILL.md has valid frontmatter with name and description', () => {
    const content = readFileSync(
      join(worktree.path, `.claude/skills/${TEST_SKILL}/SKILL.md`),
      'utf8'
    );
    expect(content).toMatch(/^---/);
    expect(content).toMatch(/\bname:/m);
    expect(content).toMatch(/\bdescription:/m);
  });

  it('SKILL.md incorporates the description — contains the distinctive marker', () => {
    const content = readFileSync(
      join(worktree.path, `.claude/skills/${TEST_SKILL}/SKILL.md`),
      'utf8'
    );
    expect(content).toContain(MARKER);
  });

  it('creates an eval file at the correct path', () => {
    expect(
      existsSync(
        join(
          worktree.path,
          `.claude/skills/${TEST_SKILL}/evals/${TEST_SKILL}.eval.ts`
        )
      )
    ).toBe(true);
  });
});

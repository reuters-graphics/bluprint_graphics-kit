import { query } from '@anthropic-ai/claude-agent-sdk';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Load .claude/skills/.env — required for API credentials.
// Copy .claude/skills/.env.example to .claude/skills/.env and fill in the values.
const envFile = join(import.meta.dirname, '../.env');
if (!existsSync(envFile)) {
  throw new Error(
    'Missing .claude/skills/.env — copy .claude/skills/.env.example to .claude/skills/.env and fill in ANTHROPIC_API_KEY, ANTHROPIC_BASE_URL, and ANTHROPIC_MODEL.'
  );
}
process.loadEnvFile(envFile);

for (const key of [
  'ANTHROPIC_API_KEY',
  'ANTHROPIC_BASE_URL',
  'ANTHROPIC_MODEL',
]) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var ${key} in .claude/skills/.env`);
  }
}

const SKILLS_DIR = join(import.meta.dirname, '..');

function parseAllowedTools(skillName: string): string[] {
  const content = readFileSync(join(SKILLS_DIR, skillName, 'SKILL.md'), 'utf8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return [];
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    if (line.slice(0, idx).trim() === 'allowed-tools') {
      return line
        .slice(idx + 1)
        .trim()
        .split(/[\s,]+/)
        .filter(Boolean);
    }
  }
  return [];
}

/**
 * Runs a skill via the Claude Agent SDK in the given worktree directory.
 *
 * The SDK discovers the skill from .claude/skills/ in the worktree and invokes
 * it the same way Claude Code does in an interactive session. Skills declared
 * in the worktree's .claude/skills/<name>/SKILL.md are loaded automatically.
 *
 * Set ANTHROPIC_BASE_URL to point at a LiteLLM proxy if needed.
 */
export async function runSkill(
  skillName: string,
  prompt: string,
  worktreePath: string
): Promise<void> {
  const allowedTools = parseAllowedTools(skillName);
  const invocation = prompt ? `/${skillName} ${prompt}` : `/${skillName}`;

  for await (const message of query({
    prompt: invocation,
    options: {
      cwd: worktreePath,
      skills: [skillName],
      allowedTools,
      model: process.env.ANTHROPIC_MODEL!,
      permissionMode: 'acceptEdits',
      env: { ...process.env },
    },
  })) {
    // Stream assistant messages to stdout so eval runs are visible
    if (
      message &&
      typeof message === 'object' &&
      'type' in message &&
      message.type !== 'system'
    ) {
      process.stdout.write(JSON.stringify(message) + '\n');
    }
  }
}

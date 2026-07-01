import { execSync, spawnSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

// Load .claude/skills/.env — required for API credentials.
// Copy .env.example to .env and fill in the values before running skill evals.
const envFile = join(import.meta.dirname, '../.env');
if (!existsSync(envFile)) {
  throw new Error(
    'Missing .claude/skills/.env — copy .claude/skills/.env.example to .claude/skills/.env and fill in ANTHROPIC_API_KEY and ANTHROPIC_BASE_URL.'
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

/**
 * Resolves the full path to the claude binary. Tries multiple shell invocation
 * modes because claude's PATH entry may live in .zshrc (interactive shells) rather
 * than .zprofile (login shells), depending on how it was installed.
 *
 * Set CLAUDE_PATH to skip discovery entirely:
 *   CLAUDE_PATH=/usr/local/bin/claude pnpm test:skills
 */
function findClaudeBin(): string {
  if (process.env.CLAUDE_PATH) return process.env.CLAUDE_PATH;

  const shell = process.env.SHELL || '/bin/sh';

  for (const flags of ['-lc', '-ic', '-c']) {
    try {
      const out = execSync(`${shell} ${flags} 'which claude'`, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
      }).trim();
      const line = out.split('\n').filter(Boolean).at(-1)?.trim();
      if (!line) continue;
      // Handle zsh alias output: "claude: aliased to /path/to/claude"
      const aliasMatch = line.match(/aliased to (.+)$/);
      const bin = aliasMatch ? aliasMatch[1].trim() : line;
      if (bin) return bin;
    } catch {
      // try next mode
    }
  }

  throw new Error(
    'Could not find the `claude` CLI.\n' +
      'Either install Claude Code or set the CLAUDE_PATH env var to the full path of your claude binary:\n' +
      '  CLAUDE_PATH=/usr/local/bin/claude pnpm test:skills'
  );
}

/**
 * Runs a skill by invoking it via its slash command in the given worktree
 * directory. Claude Code discovers the skill from .claude/skills/ in the
 * worktree, loads its SKILL.md (including frontmatter), and executes it.
 *
 * Tool permissions are granted via `allowed-tools` in the skill's frontmatter —
 * skill authors must declare which tools their skill needs.
 *
 * Set ANTHROPIC_BASE_URL to point at a LiteLLM proxy if needed.
 */
export function runSkill(
  skillName: string,
  prompt: string,
  worktreePath: string
): void {
  // Invoke the skill via its slash command, appending the test prompt as args
  const invocation = prompt ? `/${skillName} ${prompt}` : `/${skillName}`;

  const result = spawnSync(
    findClaudeBin(),
    ['-p', invocation, '--model', process.env.ANTHROPIC_MODEL!],
    {
      cwd: worktreePath,
      stdio: ['ignore', 'pipe', 'pipe'], // capture for debugging
      timeout: 120_000,
      encoding: 'utf8',
    }
  );

  // Print captured output so we can see what Claude did during the eval
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`claude exited with status ${result.status}`);
  }
}

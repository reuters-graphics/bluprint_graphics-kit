import { execSync } from 'child_process';
import { existsSync, lstatSync, symlinkSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const ROOT = join(import.meta.dirname, '../../..');

export interface Worktree {
  path: string;
  branch: string;
}

/**
 * Creates an isolated git worktree from HEAD for use in a skill eval.
 *
 * The worktree is a clean checkout of the current HEAD — any uncommitted
 * changes in the working tree are NOT included, which is intentional: evals
 * run against a known committed baseline so results are reproducible.
 *
 * `node_modules` from the main project is symlinked in so the skill can use
 * installed CLIs and packages without running a full `pnpm install`. The
 * symlink target (the real `node_modules`) is never deleted during cleanup.
 *
 * Always call `removeWorktree` in an `afterAll` to clean up.
 */
export function createWorktree(): Worktree {
  const branch = `skill-eval-${Date.now()}`;
  const path = join(tmpdir(), branch);
  execSync(`git worktree add -b ${branch} ${path}`, {
    cwd: ROOT,
    stdio: 'pipe',
  });

  // Symlink node_modules so skills can use installed CLIs and packages
  const nodeModulesSrc = join(ROOT, 'node_modules');
  if (existsSync(nodeModulesSrc)) {
    symlinkSync(nodeModulesSrc, join(path, 'node_modules'));
  }

  return { path, branch };
}

/**
 * Removes the worktree and its branch created by `createWorktree`.
 *
 * The `node_modules` symlink is removed first — `git worktree remove` would
 * otherwise see it as an untracked file and could behave unexpectedly, and
 * more importantly the real `node_modules` directory must never be deleted.
 *
 * Both the worktree directory and the temporary branch are cleaned up.
 * All operations are best-effort; errors are swallowed since the worktree
 * may already be gone if cleanup is called more than once.
 */
export function removeWorktree({ path, branch }: Worktree): void {
  // Remove the symlink before git cleans up the worktree directory — the
  // symlink target (the real node_modules) must not be deleted
  try {
    const link = join(path, 'node_modules');
    if (lstatSync(link).isSymbolicLink()) unlinkSync(link);
  } catch {
    // symlink already gone or worktree directory already removed
  }

  try {
    execSync(`git worktree remove --force ${path}`, {
      cwd: ROOT,
      stdio: 'pipe',
    });
  } catch {
    // already removed
  }
  try {
    execSync(`git branch -D ${branch}`, { cwd: ROOT, stdio: 'pipe' });
  } catch {
    // already deleted
  }
}

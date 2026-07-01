import { execSync } from 'child_process';
import { existsSync, lstatSync, symlinkSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const ROOT = join(import.meta.dirname, '../../..');

export interface Worktree {
  path: string;
  branch: string;
}

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

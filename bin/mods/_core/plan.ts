import fs from 'fs';
import os from 'os';
import path from 'path';
import { utils } from '@reuters-graphics/graphics-bin';

/**
 * A single declarative file operation. Mods build a list of these and hand it
 * to {@link applyPlan}, which executes them transactionally.
 *
 * - `copy` — read `from`, optionally substitute every key of `replace` with its
 *   value, and write to `to`. Used for rendering templates.
 * - `write` — write literal `content` to `to`.
 * - `move` — rename `from` to `to`.
 * - `remove` — delete `path` (file or directory). Tolerant of a missing target.
 */
export type FileOp =
  | { kind: 'copy'; from: string; to: string; replace?: Record<string, string> }
  | { kind: 'write'; to: string; content: string }
  | { kind: 'move'; from: string; to: string }
  | { kind: 'remove'; path: string };

export interface ApplyOptions {
  /** Absolute project root, used to print paths relative to the project. */
  root: string;
  /** Print the plan without touching disk. */
  dryRun?: boolean;
  /** Sink for human-readable progress lines (defaults to no-op). */
  log?: (message: string) => void;
}

const substitute = (content: string, replace?: Record<string, string>) => {
  if (!replace) return content;
  let out = content;
  for (const [search, value] of Object.entries(replace)) {
    out = out.split(search).join(value);
  }
  return out;
};

/** Human-readable verb + target for a planned op, relative to root. */
const describe = (op: FileOp, root: string): string => {
  const rel = (p: string) => path.relative(root, p) || '.';
  switch (op.kind) {
    case 'copy':
    case 'write':
      return `${fs.existsSync(op.to) ? 'overwrite' : 'create'} ${rel(op.to)}`;
    case 'move':
      return `move ${rel(op.from)} → ${rel(op.to)}`;
    case 'remove':
      return `remove ${rel(op.path)}`;
  }
};

/** Prefix for this tool's temp staging directories. */
const STAGING_PREFIX = 'kit-mods-';

/** Age after which an orphaned staging dir (from a killed run) is swept. */
const STAGING_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Best-effort removal of staging dirs left behind by hard-killed runs. Only
 * touches dirs older than {@link STAGING_TTL_MS}, so concurrent live runs —
 * always seconds old, possibly in other projects — are never disturbed.
 */
const sweepStaleStaging = () => {
  const now = Date.now();
  const tmp = os.tmpdir();
  let entries: string[];
  try {
    entries = fs.readdirSync(tmp);
  } catch {
    return;
  }
  for (const entry of entries) {
    if (!entry.startsWith(STAGING_PREFIX)) continue;
    const dir = path.join(tmp, entry);
    try {
      if (now - fs.statSync(dir).mtimeMs > STAGING_TTL_MS) {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    } catch {
      // Another process may have removed it mid-sweep; ignore.
    }
  }
};

/**
 * Apply a list of {@link FileOp}s to disk transactionally.
 *
 * Before each op mutates a path, the previous state is snapshotted into a temp
 * staging directory. If any op throws, every completed op is rolled back in
 * reverse order and the error is rethrown — so a mod either fully applies or
 * leaves the project untouched, never half-converted.
 *
 * With `dryRun`, the plan is printed and nothing is changed.
 */
export const applyPlan = (ops: FileOp[], options: ApplyOptions): void => {
  const { root, dryRun = false, log = () => {} } = options;

  // Validate sources up front so we fail before mutating anything.
  for (const op of ops) {
    if ((op.kind === 'copy' || op.kind === 'move') && !fs.existsSync(op.from)) {
      throw new Error(`Source not found: ${op.from}`);
    }
  }

  if (dryRun) {
    log('Planned changes (dry run — nothing written):');
    for (const op of ops) log(`  · ${describe(op, root)}`);
    return;
  }

  sweepStaleStaging();
  const staging = fs.mkdtempSync(path.join(os.tmpdir(), STAGING_PREFIX));
  const undo: (() => void)[] = [];
  let backupCounter = 0;

  /** Snapshot a path into staging and return where it was stored. */
  const backup = (target: string): string => {
    const dest = path.join(staging, String(backupCounter++));
    fs.cpSync(target, dest, { recursive: true });
    return dest;
  };

  /** Record how to put `target` back to whatever it was before this op. */
  const recordRestore = (target: string) => {
    if (fs.existsSync(target)) {
      const saved = backup(target);
      undo.push(() => {
        fs.rmSync(target, { recursive: true, force: true });
        fs.cpSync(saved, target, { recursive: true });
      });
    } else {
      undo.push(() => fs.rmSync(target, { recursive: true, force: true }));
    }
  };

  try {
    for (const op of ops) {
      const label = describe(op, root);
      switch (op.kind) {
        case 'copy': {
          recordRestore(op.to);
          const content = substitute(
            fs.readFileSync(op.from, 'utf-8'),
            op.replace
          );
          utils.fs.ensureDir(op.to);
          fs.writeFileSync(op.to, content, 'utf-8');
          break;
        }
        case 'write': {
          recordRestore(op.to);
          utils.fs.ensureDir(op.to);
          fs.writeFileSync(op.to, op.content, 'utf-8');
          break;
        }
        case 'move': {
          recordRestore(op.to);
          const savedSource = backup(op.from);
          undo.push(() => {
            utils.fs.ensureDir(op.from);
            fs.cpSync(savedSource, op.from, { recursive: true });
          });
          utils.fs.ensureDir(op.to);
          fs.rmSync(op.to, { recursive: true, force: true });
          fs.renameSync(op.from, op.to);
          break;
        }
        case 'remove': {
          if (!fs.existsSync(op.path)) break;
          const saved = backup(op.path);
          const target = op.path;
          undo.push(() => fs.cpSync(saved, target, { recursive: true }));
          fs.rmSync(op.path, { recursive: true, force: true });
          break;
        }
      }
      log(`  · ${label}`);
    }
  } catch (error) {
    for (const step of undo.reverse()) {
      try {
        step();
      } catch {
        // Best-effort rollback; surface the original error below.
      }
    }
    throw error;
  } finally {
    fs.rmSync(staging, { recursive: true, force: true });
  }
};

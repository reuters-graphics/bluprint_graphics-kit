import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { applyPlan, type FileOp } from './plan';

describe('applyPlan', () => {
  let root: string;
  const read = (p: string) => fs.readFileSync(path.join(root, p), 'utf-8');
  const exists = (p: string) => fs.existsSync(path.join(root, p));

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'plan-test-'));
    fs.writeFileSync(path.join(root, 'src.txt'), 'SOURCE');
    fs.writeFileSync(path.join(root, 'existing.txt'), 'ORIGINAL');
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('copies with substitutions and overwrites', () => {
    fs.writeFileSync(path.join(root, 'tpl.txt'), 'hello NAME');
    applyPlan(
      [
        {
          kind: 'copy',
          from: path.join(root, 'tpl.txt'),
          to: path.join(root, 'out.txt'),
          replace: { NAME: 'world' },
        },
        { kind: 'write', to: path.join(root, 'existing.txt'), content: 'NEW' },
      ],
      { root }
    );
    expect(read('out.txt')).toBe('hello world');
    expect(read('existing.txt')).toBe('NEW');
  });

  it('dry run writes nothing', () => {
    applyPlan(
      [{ kind: 'write', to: path.join(root, 'nope.txt'), content: 'X' }],
      { root, dryRun: true }
    );
    expect(exists('nope.txt')).toBe(false);
  });

  it('is tolerant of removing a missing path', () => {
    expect(() =>
      applyPlan([{ kind: 'remove', path: path.join(root, 'ghost') }], { root })
    ).not.toThrow();
  });

  it('rejects up front when a source is missing, changing nothing', () => {
    const ops: FileOp[] = [
      { kind: 'write', to: path.join(root, 'created.txt'), content: 'CREATED' },
      {
        kind: 'copy',
        from: path.join(root, 'does-not-exist.txt'),
        to: path.join(root, 'x.txt'),
      },
    ];
    expect(() => applyPlan(ops, { root })).toThrow(/Source not found/);
    expect(exists('created.txt')).toBe(false);
  });

  it('rolls back completed ops when a later op fails mid-run', () => {
    // A file where a directory is expected makes the third op throw at execution
    // time (not validation), after the first two have already applied.
    fs.writeFileSync(path.join(root, 'blocker'), 'x');
    const ops: FileOp[] = [
      { kind: 'write', to: path.join(root, 'created.txt'), content: 'CREATED' },
      { kind: 'remove', path: path.join(root, 'existing.txt') },
      {
        kind: 'copy',
        from: path.join(root, 'src.txt'),
        to: path.join(root, 'blocker/child.txt'),
      },
    ];
    expect(() => applyPlan(ops, { root })).toThrow();
    // Everything restored: created file gone, removed file back.
    expect(exists('created.txt')).toBe(false);
    expect(read('existing.txt')).toBe('ORIGINAL');
  });
});

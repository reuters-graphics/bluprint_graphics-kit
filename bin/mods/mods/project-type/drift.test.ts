import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { moduleDir } from '../../_core/dirname';
import { buildPlan } from '.';

/**
 * The project ships as `pages-plus`, so that variant's template files duplicate
 * the live project files. This guard fails loudly if the two ever drift.
 *
 * It's driven by the mod's own plan: for every `copy` the pages-plus switch
 * would perform, the template source must byte-match the live file it targets.
 * Any file added to the plan is covered automatically; stubs never referenced
 * by the plan are ignored.
 */
const repoRoot = path.resolve(moduleDir(import.meta.url), '../../../..');

describe('project-type: pages-plus template mirrors the live project', () => {
  const copies = buildPlan('pages-plus', repoRoot).filter(
    (op) => op.kind === 'copy'
  );

  it('has a sanity-check baseline of files to compare', () => {
    expect(copies.length).toBeGreaterThan(0);
  });

  for (const op of copies) {
    if (op.kind !== 'copy') continue;
    const rel = path.relative(repoRoot, op.to);
    it(`${rel} is in sync`, () => {
      expect(fs.existsSync(op.from), `missing template: ${op.from}`).toBe(true);
      expect(fs.existsSync(op.to), `missing live file: ${op.to}`).toBe(true);
      expect(
        fs.readFileSync(op.from, 'utf8'),
        `template ${op.from} has drifted from live ${op.to}; re-copy the live file into the template`
      ).toBe(fs.readFileSync(op.to, 'utf8'));
    });
  }
});

import { log } from '@clack/prompts';
import type { ModContext } from '../../bin/mods/_core/context';
import { applyPlan, type FileOp } from '../../bin/mods/_core/plan';
import { PackageJsonManager } from '../../bin/mods/_core/pkg';

/**
 * Build a {@link ModContext} for tests: prompts return queued `answers` in
 * order, file ops apply for real against `root`. Lets us exercise a mod's logic
 * without a TTY.
 */
export const createTestContext = (
  root: string,
  answers: unknown[] = [],
  opts: { dryRun?: boolean } = {}
): ModContext => {
  const queue = [...answers];
  const next = () => {
    if (!queue.length) throw new Error('No stubbed prompt answer left');
    return queue.shift();
  };
  const dryRun = !!opts.dryRun;
  return {
    root,
    dryRun,
    log,
    select: (async () => next()) as ModContext['select'],
    confirm: (async () => next()) as ModContext['confirm'],
    text: (async () => next()) as ModContext['text'],
    apply: (ops: FileOp[]) =>
      applyPlan(ops, { root, dryRun, log: (m) => log.step(m) }),
    pkg: () => new PackageJsonManager(),
  };
};

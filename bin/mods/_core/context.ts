import { log } from '@clack/prompts';
import { resolveProjectRoot } from './locations';
import { applyPlan, type FileOp } from './plan';
import { PackageJsonManager } from './pkg';
import { promptConfirm, promptSelect, promptText } from './cancel';

/**
 * The toolkit handed to every mod's `run()`. It bundles the validated project
 * root, cancellation-aware prompts, the clack logger, and the transactional
 * file-op runner — so mods contain intent, not plumbing.
 */
export interface ModContext {
  /** Absolute, validated project root. */
  root: string;
  /** Whether this invocation should only print its plan. */
  dryRun: boolean;
  /** clack logger (`log.info`, `log.step`, `log.error`, …). */
  log: typeof log;
  select: typeof promptSelect;
  confirm: typeof promptConfirm;
  text: typeof promptText;
  /** Apply file operations transactionally, honouring `dryRun`. */
  apply: (ops: FileOp[]) => void;
  /** Lazily construct a package.json editor (only touches disk when called). */
  pkg: () => PackageJsonManager;
}

/**
 * Build a {@link ModContext} for the current invocation. Throws
 * `NotAProjectError` if run outside a graphics-kit project.
 */
export const createContext = (opts: { dryRun?: boolean } = {}): ModContext => {
  const root = resolveProjectRoot();
  const dryRun = !!opts.dryRun;
  return {
    root,
    dryRun,
    log,
    select: promptSelect,
    confirm: promptConfirm,
    text: promptText,
    apply: (ops) => applyPlan(ops, { root, dryRun, log: (m) => log.step(m) }),
    pkg: () => new PackageJsonManager(),
  };
};

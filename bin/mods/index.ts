import sade from 'sade';
import { intro } from '@reuters-graphics/clack';
import { cancel, isCancel, log, outro, select } from '@clack/prompts';
import { registry, type ModDescriptor } from './registry';
import { createContext } from './_core/context';
import { CancelledError } from './_core/cancel';
import { NotAProjectError } from './_core/locations';

/**
 * Run a mod with a fresh context and uniform error handling: cancellations exit
 * cleanly, "not a project" errors report themselves, and any other failure is
 * surfaced without a half-finished "Done."
 */
const dispatch = async (mod: ModDescriptor, opts: Record<string, unknown>) => {
  try {
    const ctx = createContext({ dryRun: !!opts['dry-run'] });
    await mod.run(ctx, opts);
    outro(ctx.dryRun ? 'Dry run complete.' : 'Done.');
  } catch (error) {
    if (error instanceof CancelledError) return cancel('Cancelled.');
    if (error instanceof NotAProjectError) return cancel(error.message);
    log.error(error instanceof Error ? error.message : String(error));
    outro('Failed.');
    process.exitCode = 1;
  }
};

const prog = sade('kit-mods');

prog.option('--dry-run', 'Preview changes without writing any files', false);

// Interactive picker over all menu-visible mods.
prog.command('mods').action(async (opts) => {
  intro('Kit mods');
  const menu = registry.filter((m) => m.menu);
  const chosen = await select({
    message: 'Which mod do you want?',
    options: menu.map((m) => ({ value: m.id, label: m.label, hint: m.hint })),
    initialValue: menu[0]?.id,
  });
  if (isCancel(chosen)) return cancel();
  const mod = registry.find((m) => m.id === chosen);
  if (mod) await dispatch(mod, opts);
});

// Dedicated top-level command for each mod that declares one.
for (const mod of registry) {
  if (!mod.command) continue;
  let cmd = prog.command(mod.command.name);
  for (const [flag, desc, value] of mod.command.options ?? []) {
    cmd = cmd.option(flag, desc, value);
  }
  cmd.action(async (opts) => {
    intro('Kit mods');
    await dispatch(mod, opts);
  });
}

prog.parse(process.argv);

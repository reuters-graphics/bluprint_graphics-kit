import { confirm, isCancel, select, text, type Option } from '@clack/prompts';

/**
 * Thrown when a user cancels a prompt (Ctrl-C / Esc). Caught once at the CLI
 * top level and turned into a clean `cancel()` exit, so individual mods never
 * need to litter `isCancel` checks through their logic.
 */
export class CancelledError extends Error {
  constructor() {
    super('Cancelled');
    this.name = 'CancelledError';
  }
}

/** `@clack/prompts` select that throws {@link CancelledError} on cancel. */
export const promptSelect = async <T>(opts: {
  message: string;
  options: Option<T>[];
  initialValue?: T;
}): Promise<T> => {
  const result = await select<T>(opts);
  if (isCancel(result)) throw new CancelledError();
  return result as T;
};

/** `@clack/prompts` confirm that throws {@link CancelledError} on cancel. */
export const promptConfirm = async (opts: {
  message: string;
}): Promise<boolean> => {
  const result = await confirm(opts);
  if (isCancel(result)) throw new CancelledError();
  return result;
};

/** `@clack/prompts` text input that throws {@link CancelledError} on cancel. */
export const promptText = async (opts: {
  message: string;
  placeholder?: string;
  initialValue?: string;
}): Promise<string> => {
  const result = await text(opts);
  if (isCancel(result)) throw new CancelledError();
  return result;
};

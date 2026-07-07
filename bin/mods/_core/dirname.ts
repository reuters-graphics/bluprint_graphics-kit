import * as url from 'url';

/**
 * Resolve the directory of the module that owns `importMetaUrl`.
 *
 * Mods run as raw TypeScript via `tsx`, so templates are resolved relative to
 * their own source file. Every mod that ships templates calls this with
 * `import.meta.url`.
 *
 * @example
 * ```typescript
 * const __dirname = moduleDir(import.meta.url);
 * ```
 */
export const moduleDir = (importMetaUrl: string) =>
  url.fileURLToPath(new URL('.', importMetaUrl));

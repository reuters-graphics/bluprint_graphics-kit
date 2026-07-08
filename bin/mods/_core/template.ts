import path from 'path';
import type { FileOp, Replacement } from './plan';

export interface TemplateCopyOptions {
  /** Substitutions applied to the copied file's contents. */
  replace?: Replacement[];
  /**
   * Substitutions applied to destination path segments, e.g.
   * `{ '[locale]': 'en', '[slug]': 'my-chart' }`. Placeholders follow
   * SvelteKit's `[param]` convention so the template tree reads like a route.
   */
  pathReplace?: Record<string, string>;
}

/**
 * Build one explicit `copy` op for a single template file.
 *
 * Template trees mirror the project's root-relative structure, so `relPath` is
 * both where the file lives in the template and where it lands in the project —
 * you name each file you intend to copy, one op per file. Files you don't name
 * (e.g. `$types.d.ts` stubs kept only for `svelte-check`) simply aren't copied.
 *
 * `[param]` segments in `relPath` are resolved for the destination via
 * `pathReplace`; the source keeps the literal placeholder path.
 */
export const templateCopyOp = (
  templateDir: string,
  destRoot: string,
  relPath: string,
  options: TemplateCopyOptions = {}
): FileOp => {
  let destRel = relPath;
  for (const [placeholder, value] of Object.entries(
    options.pathReplace ?? {}
  )) {
    destRel = destRel.split(placeholder).join(value);
  }
  return {
    kind: 'copy',
    from: path.join(templateDir, relPath),
    to: path.join(destRoot, destRel),
    replace: options.replace,
  };
};

import * as find from 'empathic/find';
import path from 'path';
import fs from 'fs';

/**
 * Error thrown when a mod is run outside a graphics-kit project.
 */
export class NotAProjectError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotAProjectError';
  }
}

/**
 * Resolve and validate the root of the graphics-kit project the mod is running
 * against.
 *
 * Walks up from the current working directory to find `package.json`, then
 * checks the directory looks like a graphics project (it has a
 * `publisher.config.ts`). Throws a clear {@link NotAProjectError} instead of
 * the opaque failures you'd get from a bare non-null assertion when run in the
 * wrong place.
 *
 * **Note:** Derived from the CWD so it works with tests that run in a temporary
 * working directory.
 */
export const resolveProjectRoot = (): string => {
  const pkg = find.up('package.json', { cwd: process.cwd() });
  if (!pkg) {
    throw new NotAProjectError(
      'Could not find a package.json. Run this from inside a graphics project.'
    );
  }
  const root = path.dirname(pkg);
  if (!fs.existsSync(path.join(root, 'publisher.config.ts'))) {
    throw new NotAProjectError(
      `This does not look like a graphics-kit project (no publisher.config.ts in ${root}).`
    );
  }
  return root;
};

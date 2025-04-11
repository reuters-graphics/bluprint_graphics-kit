import * as find from 'empathic/find';
import path from 'path';

/**
 * Get primary locations for the project.
 *
 * **Note:** These need to be derived from the CWD to work
 * with tests in the temporary working directory.
 */
export const getLocations = () => {
  const PKG = find.up('package.json', { cwd: process.cwd() })!;
  const ROOT = path.dirname(PKG);
  return { PKG, ROOT };
};

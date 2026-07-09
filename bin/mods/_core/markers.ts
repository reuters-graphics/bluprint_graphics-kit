import fs from 'fs';
import path from 'path';

/**
 * Path to a mod "marker" file. Markers record one-way conversions a project has
 * undergone (e.g. `blog`) so mods can refuse to run when they no longer apply.
 * They live under `bin/mods/` and are committed as durable project state.
 */
export const markerFile = (root: string, name: string) =>
  path.join(root, 'bin/mods', `.converted-to-${name}`);

/** Whether the given marker is present in the project. */
export const hasMarker = (root: string, name: string) =>
  fs.existsSync(markerFile(root, name));

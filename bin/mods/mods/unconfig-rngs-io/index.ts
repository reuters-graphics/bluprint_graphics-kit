import path from 'path';
import { moduleDir } from '../../_core/dirname';
import type { ModContext } from '../../_core/context';

const templatesDir = path.join(moduleDir(import.meta.url), 'templates');

/**
 * Replace the project's `+layout.ts` with a static loader that reads content
 * from the local ArchieML file instead of RNGS.io live endpoints.
 */
export const unconfigRngsIo = (ctx: ModContext) => {
  ctx.apply([
    {
      kind: 'copy',
      from: path.join(templatesDir, '+layout.ts'),
      to: path.join(ctx.root, 'pages/+layout.ts'),
    },
  ]);
};

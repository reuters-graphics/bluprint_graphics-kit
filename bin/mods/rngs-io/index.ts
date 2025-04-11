import { getLocations } from '../_utils/locations';
import * as url from 'url';
import path from 'path';
import { Mod } from '../_utils/mod';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const templatesDir = path.join(__dirname, 'templates');

const mod = new Mod();

export const unconfigRngsIo = () => {
  const { ROOT } = getLocations();
  const pagesDir = path.join(ROOT, 'pages');

  mod.fs.copy([templatesDir, '+layout.ts'], [pagesDir, '+layout.ts']);
};

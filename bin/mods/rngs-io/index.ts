import { getLocations } from '../_utils/locations';
import { swap } from '../_utils/swap';
import * as url from 'url';
import path from 'path';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const templatesDir = path.join(__dirname, 'templates');

export const unconfigRngsIo = () => {
  const { ROOT } = getLocations();
  const pagesDir = path.join(ROOT, 'pages');

  swap([templatesDir, '+layout.ts'], [pagesDir, '+layout.ts'], []);
};

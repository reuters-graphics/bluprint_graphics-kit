import { ROOT } from '../_utils/locations';
import { swap } from '../project-type/utils/swap';
import * as url from 'url';
import path from 'path';

const pagesDir = path.join(ROOT, 'pages');
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const templatesDir = path.join(__dirname, 'templates');

export const unconfigRngsIo = () => {
  swap([templatesDir, '+layout.ts'], [pagesDir, '+layout.ts'], []);
};

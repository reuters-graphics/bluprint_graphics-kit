import { getLocations } from '../_utils/locations';
import * as url from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const templatesDir = path.join(__dirname, 'templates');

export const unconfigRngsIo = () => {
  const { ROOT } = getLocations();
  const pagesDir = path.join(ROOT, 'pages');

  fs.copyFileSync(
    path.join(templatesDir, '+layout.ts'),
    path.join(pagesDir, '+layout.ts')
  );
};

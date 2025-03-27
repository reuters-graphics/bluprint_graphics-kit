import * as find from 'empathic/find';
import path from 'path';

export const PKG = find.up('package.json')!;
export const ROOT = path.dirname(PKG);

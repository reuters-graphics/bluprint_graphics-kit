import { FileMover } from './fs';
import { MagicFile } from './magicFile';
import { PackageJsonManager } from './pkg';

export class Mod {
  pkg = new PackageJsonManager();
  fs = new FileMover();
  magicFile(filePath: string) {
    return new MagicFile(filePath);
  }
}

import fs from 'fs';
import path from 'path';
import { utils } from '@reuters-graphics/graphics-bin';

/**
 * Swap some files.
 *
 * Can swap files around in ways including:
 * 1. Swap a source with a destination, optionally archiving the original.
 * 2. Move the desitination to an archive, effectively removing it.
 *
 * @param srcPath Array of path parts to a file you want swapped _in_
 * @param destPath Array of path parts to a file you want swapped _out_
 * @param archivePath Array of path parts to where you want the swapped _out_ file archived
 */
export const swap = (
  srcPath: string[],
  destPath: string[],
  archivePath: string[]
) => {
  const absSrcPath = path.join(...srcPath);
  const absDestPath = path.join(...destPath);
  const absArchivePath = path.join(...archivePath);

  if ((absArchivePath === '.' && absSrcPath === '.') || absDestPath === '.') {
    throw new Error('Invalid swap');
  }

  if (absArchivePath !== '.') {
    if (!fs.existsSync(absDestPath))
      throw new Error(`File not found: ${absDestPath}`);
    utils.fs.ensureDir(absArchivePath);
    fs.renameSync(absDestPath, absArchivePath);
    if (fs.readdirSync(path.dirname(absDestPath)).length === 0)
      fs.rmSync(path.dirname(absDestPath), { recursive: true });
  }

  if (absSrcPath !== '.') {
    if (!fs.existsSync(absSrcPath))
      throw new Error(`File not found: ${absSrcPath}`);
    utils.fs.ensureDir(absDestPath);
    fs.renameSync(absSrcPath, absDestPath);
    if (fs.readdirSync(path.dirname(absSrcPath)).length === 0)
      fs.rmSync(path.dirname(absSrcPath), { recursive: true });
  }
};

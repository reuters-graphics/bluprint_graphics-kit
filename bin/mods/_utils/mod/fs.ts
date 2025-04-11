import fs from 'fs';
import path from 'path';
import { utils } from '@reuters-graphics/graphics-bin';

/**
 * Class for managing file operations such as swapping, copying, moving, and removing files.
 */
export class FileMover {
  /**
   * Ensures the given path is treated as an array of path parts.
   * Converts a string path to an array containing the single path.
   * @param pathOrParts - The path as a string or an array of strings.
   * @returns An array of path parts.
   */
  private ensureArrayPath(pathOrParts: string | string[]): string[] {
    return Array.isArray(pathOrParts) ? pathOrParts : [pathOrParts];
  }

  /**
   * Joins path parts into a full path string.
   * @param pathOrParts - The path as a string or an array of strings.
   * @returns The absolute path string.
   */
  private getAbsolutePath(pathOrParts: string | string[]): string {
    return path.join(...this.ensureArrayPath(pathOrParts));
  }

  /**
   * Swaps two files, optionally archiving the original destination file.
   * If an archive path is provided, the destination file is moved there.
   * The source file is moved to the destination path.
   *
   * @param srcPath - Source file path (string or array of path parts).
   * @param destPath - Destination file path (string or array of path parts).
   * @param archivePath - Archive file path (string or array of path parts).
   *
   * @example
   * ```typescript
   * const fileMover = new FileMover();
   * fileMover.swap('src.txt', 'dest.txt', 'archive/dest.txt');
   * ```
   */
  swap(
    srcPath: string | string[],
    destPath: string | string[],
    archivePath: string | string[]
  ) {
    const absSrcPath = this.getAbsolutePath(srcPath);
    const absDestPath = this.getAbsolutePath(destPath);
    const absArchivePath = this.getAbsolutePath(archivePath);

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
  }

  /**
   * Copies a file from the source path to the destination path.
   * Ensures the destination directory exists before copying.
   *
   * @param srcPath - Source file path (string or array of path parts).
   * @param destPath - Destination file path (string or array of path parts).
   *
   * @example
   * ```typescript
   * const fileMover = new FileMover();
   * fileMover.copy('src.txt', 'dest.txt');
   * ```
   */
  copy(srcPath: string | string[], destPath: string | string[]) {
    const absSrcPath = this.getAbsolutePath(srcPath);
    const absDestPath = this.getAbsolutePath(destPath);

    if (!fs.existsSync(absSrcPath))
      throw new Error(`File not found: ${absSrcPath}`);

    utils.fs.ensureDir(absDestPath);
    fs.copyFileSync(absSrcPath, absDestPath);
  }

  /**
   * Moves a file from the source path to the destination path.
   * Ensures the destination directory exists before moving.
   *
   * @param srcPath - Source file path (string or array of path parts).
   * @param destPath - Destination file path (string or array of path parts).
   *
   * @example
   * ```typescript
   * const fileMover = new FileMover();
   * fileMover.move('src.txt', 'dest.txt');
   * ```
   */
  move(srcPath: string | string[], destPath: string | string[]) {
    const absSrcPath = this.getAbsolutePath(srcPath);
    const absDestPath = this.getAbsolutePath(destPath);

    if (!fs.existsSync(absSrcPath))
      throw new Error(`File not found: ${absSrcPath}`);

    utils.fs.ensureDir(absDestPath);
    fs.renameSync(absSrcPath, absDestPath);
  }

  /**
   * Removes a file or directory at the specified path.
   * The removal is recursive and forced, meaning it will delete directories and their contents.
   *
   * @param filePath - File or directory path (string or array of path parts).
   *
   * @example
   * ```typescript
   * const fileMover = new FileMover();
   * fileMover.remove('old-file.txt');
   * ```
   */
  remove(filePath: string | string[]) {
    const absFilePath = this.getAbsolutePath(filePath);

    if (!fs.existsSync(absFilePath))
      throw new Error(`File not found: ${absFilePath}`);

    fs.rmSync(absFilePath, { recursive: true, force: true });
  }
}

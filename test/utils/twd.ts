import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import ignore from 'ignore';
import fsPromises from 'fs/promises';
import { globSync } from 'glob';
import { execSync } from 'child_process';

export class TestWorkingDirectory {
  CWD = process.cwd();
  // A unique directory in the system temp dir (rather than inside the repo's
  // own test/ folder). `node_modules` is symlinked in by absolute path, so the
  // location doesn't matter, and os.tmpdir() is writable in GitHub Actions.
  TWD = fs.mkdtempSync(path.join(os.tmpdir(), 'bluprint-graphics-kit-'));

  private async createSymlink(srcPath: string) {
    const symlinkSource = path.join(this.CWD, srcPath);
    const symlinkDest = path.join(this.TWD, srcPath);
    if (await fs.pathExists(symlinkSource)) {
      await fs.symlink(symlinkSource, symlinkDest, 'junction');
    }
  }

  /**
   * Creates a test working directory, with all source files and
   * symlinked node_modules.
   */
  async setupTWD() {
    await fs.emptyDir(this.TWD);

    const gitignorePath = path.join(this.CWD, '.gitignore');
    const ig = ignore();

    const gitignoreContent = await fsPromises.readFile(gitignorePath, 'utf8');
    ig.add(gitignoreContent);

    const sourceFiles = globSync('**/*', {
      cwd: this.CWD,
      nodir: true,
      ignore: ['**/node_modules/**'],
    }).filter(ig.createFilter());

    for (const file of sourceFiles) {
      const srcPath = path.join(this.CWD, file);
      const destPath = path.join(this.TWD, file);

      await fs.ensureDir(path.dirname(destPath));
      await fs.copyFile(srcPath, destPath);
    }

    await this.createSymlink('node_modules');
  }

  async cleanupTWD() {
    await fs.remove(this.TWD);
  }

  async setup() {
    await this.setupTWD();
    process.chdir(this.TWD);
    execSync('svelte-kit sync');
  }

  async cleanup() {
    await this.cleanupTWD();
    process.chdir(this.CWD);
  }
}

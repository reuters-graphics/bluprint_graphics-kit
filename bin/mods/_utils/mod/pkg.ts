import fs from 'fs';
import * as find from 'empathic/find';

export class PackageJsonManager {
  private packageJson: {
    scripts: Record<string, string>;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };
  private filePath: string;

  constructor() {
    this.filePath = find.up('package.json', { cwd: process.cwd() })!;
    this.loadPackageJson();
  }

  private loadPackageJson(): void {
    if (fs.existsSync(this.filePath)) {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      this.packageJson = JSON.parse(data);
    } else {
      throw new Error('package.json file not found.');
    }
  }

  private savePackageJson(): void {
    fs.writeFileSync(
      this.filePath,
      JSON.stringify(this.packageJson, null, 2),
      'utf-8'
    );
  }

  private sortObjectKeys(obj: Record<string, string>): Record<string, string> {
    return Object.keys(obj)
      .sort()
      .reduce((result: Record<string, string>, key: string) => {
        result[key] = obj[key];
        return result;
      }, {});
  }

  addDependency(name: string, version: string): void {
    if (!this.packageJson.dependencies) {
      this.packageJson.dependencies = {};
    }
    this.packageJson.dependencies[name] = version;
    this.packageJson.dependencies = this.sortObjectKeys(
      this.packageJson.dependencies
    );
    this.savePackageJson();
  }

  removeDependency(name: string): void {
    if (this.packageJson.dependencies && this.packageJson.dependencies[name]) {
      delete this.packageJson.dependencies[name];
      this.packageJson.dependencies = this.sortObjectKeys(
        this.packageJson.dependencies
      );
      this.savePackageJson();
    }
  }

  addDevDependency(name: string, version: string): void {
    if (!this.packageJson.devDependencies) {
      this.packageJson.devDependencies = {};
    }
    this.packageJson.devDependencies[name] = version;
    this.packageJson.devDependencies = this.sortObjectKeys(
      this.packageJson.devDependencies
    );
    this.savePackageJson();
  }

  removeDevDependency(name: string): void {
    if (
      this.packageJson.devDependencies &&
      this.packageJson.devDependencies[name]
    ) {
      delete this.packageJson.devDependencies[name];
      this.packageJson.devDependencies = this.sortObjectKeys(
        this.packageJson.devDependencies
      );
      this.savePackageJson();
    }
  }

  addScript(name: string, command: string): void {
    if (!this.packageJson.scripts) {
      this.packageJson.scripts = {};
    }
    this.packageJson.scripts[name] = command;
    this.savePackageJson();
  }

  removeScript(name: string): void {
    if (this.packageJson.scripts && this.packageJson.scripts[name]) {
      delete this.packageJson.scripts[name];
      this.savePackageJson();
    }
  }
}

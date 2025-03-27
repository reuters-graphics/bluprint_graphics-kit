import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import dedent from 'dedent';

const MAX_SIZE = 100 * 1024 * 1024; // 100MB

console.log(`💾 Checking staged files for any oversized ...\n`);

const stagedFiles = execSync('git diff --cached --name-only', {
  encoding: 'utf-8',
})
  .split('\n')
  .filter(Boolean);

let hasOversizeFile = false;

for (const file of stagedFiles) {
  const filePath = path.resolve(process.cwd(), file);
  if (!fs.existsSync(filePath)) continue;

  const stats = fs.statSync(filePath);
  if (stats.size > MAX_SIZE) {
    console.error(
      `❌ File too large to commit: ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`
    );

    execSync(`git reset HEAD "${file}"`);
    console.log(`↩️ Unstaged from commit`);

    const gitignorePath = path.resolve(process.cwd(), '.gitignore');
    const gitignoreContents =
      fs.existsSync(gitignorePath) ?
        fs.readFileSync(gitignorePath, 'utf-8')
      : '';

    if (!gitignoreContents.includes(file)) {
      fs.appendFileSync(
        gitignorePath,
        `\n# Auto-ignored oversize file\n${file}\n`
      );
      console.log(`✅ Added to .gitignore\n`);
    }

    hasOversizeFile = true;
  }
}

if (hasOversizeFile) {
  console.log(dedent`
  💀 GIT COMMIT BLOCKED

  Your project had at least one file larger than 100 MB, which is too large to push to GitHub.

  Any oversize files have been added to your .gitignore and unstaged from the commit.
  
  Try committing again.
  `);
  process.exit(1); // block the commit
} else {
  console.log(`✅ Staged files OK!`);
}

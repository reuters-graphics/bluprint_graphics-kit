import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname, basename, relative } from 'path';
import fsExtra from 'fs-extra';
const { copySync, ensureDirSync } = fsExtra;
import { globSync } from 'glob';
import { fileURLToPath } from 'url';
import pc from 'picocolors';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');
const LLMS_DIR = join(ROOT, '.claude/llms');
const SENTINEL_START = '<!-- llms-deps:start -->';
const SENTINEL_END = '<!-- llms-deps:end -->';

// ── Config ────────────────────────────────────────────────────────────────────
// Add package names here as they adopt the llms field in their package.json.
const PACKAGES = [
  '@reuters-graphics/graphics-components',
  '@reuters-graphics/graphics-kit-publisher',
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function pkgDirName(pkg) {
  return pkg.includes('/') ? pkg.split('/').pop() : pkg;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const result = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    result[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return result;
}

function getGlobBase(pattern) {
  // './dist/llm-docs/**/*' → 'dist/llm-docs'
  const normalized = pattern.replace(/^\.\//, '');
  const starIdx = normalized.indexOf('*');
  return starIdx === -1 ? normalized : (
      normalized.slice(0, starIdx).replace(/\/$/, '')
    );
}

function resolveClaude() {
  for (const name of ['CLAUDE.md', 'PROJECT_CLAUDE.md']) {
    const p = join(ROOT, name);
    if (existsSync(p) && readFileSync(p, 'utf8').includes(SENTINEL_START))
      return p;
  }
  throw new Error(
    `No CLAUDE.md or PROJECT_CLAUDE.md with ${SENTINEL_START} sentinels found`
  );
}

// ── Step 1: Hoist docs from node_modules ─────────────────────────────────────

const hoisted = new Map(); // dirName → { name, description }

for (const pkg of PACKAGES) {
  const pkgJsonPath = join(ROOT, 'node_modules', pkg, 'package.json');
  if (!existsSync(pkgJsonPath)) {
    console.warn(pc.yellow(`⚠ ${pkg} not found in node_modules, skipping`));
    continue;
  }

  const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
  if (!pkgJson.llms) {
    console.warn(
      pc.yellow(`⚠ ${pkg} has no llms field in package.json, skipping`)
    );
    continue;
  }

  const { description, files } = pkgJson.llms;
  const pkgDir = join(ROOT, 'node_modules', pkg);
  const dirName = pkgDirName(pkg);
  const destDir = join(LLMS_DIR, dirName);

  ensureDirSync(destDir);

  for (const pattern of files) {
    const base = getGlobBase(pattern);
    const matched = globSync(pattern, { cwd: pkgDir, nodir: true });
    for (const file of matched) {
      const stripped = base ? relative(base, file) : file;
      const dest = join(destDir, stripped);
      ensureDirSync(dirname(dest));
      copySync(join(pkgDir, file), dest, { overwrite: true });
    }
  }

  const desc = Array.isArray(description) ? description.join(' ') : description;
  hoisted.set(dirName, { name: pkg, description: desc });
  console.log(pc.green(`✓ Hoisted ${pkg} → .claude/llms/${dirName}/`));
}

// ── Step 2: Build table from all .claude/llms/ subdirs ───────────────────────

const llmsDirs = readdirSync(LLMS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const rows = [];

for (const dir of llmsDirs) {
  if (hoisted.has(dir)) {
    const { name, description } = hoisted.get(dir);
    const entryFile =
      existsSync(join(LLMS_DIR, dir, 'index.md')) ?
        `.claude/llms/${dir}/index.md`
      : `.claude/llms/${dir}/docs.md`;
    rows.push({ name: `\`${name}\``, description, link: entryFile });
  } else {
    // Hand-maintained: read name and description from docs.md frontmatter
    const docsPath = join(LLMS_DIR, dir, 'docs.md');
    if (!existsSync(docsPath)) {
      console.warn(
        pc.yellow(`⚠ .claude/llms/${dir}/ has no docs.md, skipping`)
      );
      continue;
    }
    const fm = parseFrontmatter(readFileSync(docsPath, 'utf8'));
    if (!fm?.name || !fm?.description) {
      console.warn(
        pc.yellow(
          `⚠ .claude/llms/${dir}/docs.md missing frontmatter name/description, skipping`
        )
      );
      continue;
    }
    rows.push({
      name: fm.name,
      description: fm.description,
      link: `.claude/llms/${dir}/docs.md`,
    });
  }
}

const table = [
  '| Dependency | Context doc | When to use |',
  '|---|---|---|',
  ...rows.map(
    ({ name, description, link }) =>
      `| ${name} | [\`${link}\`](${link}) | ${description} |`
  ),
].join('\n');

// ── Step 3: Replace sentinel block in CLAUDE.md ───────────────────────────────

const claudePath = resolveClaude();
const content = readFileSync(claudePath, 'utf8');

const startIdx = content.indexOf(SENTINEL_START);
const endIdx = content.indexOf(SENTINEL_END);

if (startIdx === -1 || endIdx === -1) {
  console.error(
    pc.red(`✗ Could not find llms-deps sentinels in ${basename(claudePath)}`)
  );
  process.exit(1);
}

const updated =
  content.slice(0, startIdx + SENTINEL_START.length) +
  '\n' +
  table +
  '\n' +
  content.slice(endIdx);

writeFileSync(claudePath, updated, 'utf8');
console.log(
  pc.green(`✓ Updated Key dependencies table in ${basename(claudePath)}`)
);

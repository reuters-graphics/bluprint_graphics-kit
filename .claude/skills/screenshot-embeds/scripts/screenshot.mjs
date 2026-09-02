#!/usr/bin/env node

/**
 * Screenshots every embed page and saves the images as share images.
 *
 * Usage: node .claude/skills/screenshot-embeds/scripts/screenshot.mjs
 *
 * Options:
 *   --viewports '{"en/map": {"width": 1200, "height": 628}}'
 *       Override the default viewport size for a specific locale/slug.
 *       Slug-only keys are also accepted for backwards compatibility.
 *
 * Requirements:
 *   - A Chrome/Chromium binary (Puppeteer cache or system PATH)
 *   - puppeteer-core (installed to /tmp on demand if missing)
 */

import { execFileSync, execSync, spawn } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, relative, resolve } from 'node:path';
import { parseArgs } from 'node:util';

const PROJECT_ROOT = resolve(import.meta.dirname, '..', '..', '..', '..');
const EMBEDS_DIR = resolve(PROJECT_ROOT, 'pages/embeds');
const IMAGES_DIR = resolve(PROJECT_ROOT, 'src/statics/images/embeds');
const DEFAULT_PORT = 5199;
const DEFAULT_VIEWPORT = { width: 1200, height: 628 };
const BASE = (port) => `http://127.0.0.1:${port}`;

const { values: args } = parseArgs({
  options: {
    viewports: { type: 'string', default: '{}' },
    port: { type: 'string', default: String(DEFAULT_PORT) },
  },
  strict: false,
});

const port = Number.parseInt(args.port, 10);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error(`Invalid --port value: ${args.port}`);
  process.exit(1);
}

let customViewports = {};
try {
  customViewports = JSON.parse(args.viewports);
} catch {
  console.error('Warning: could not parse --viewports JSON, using defaults.');
}

function isDir(path) {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

function discoverEmbeds() {
  if (!existsSync(EMBEDS_DIR)) return [];

  const embeds = [];
  for (const locale of readdirSync(EMBEDS_DIR).sort()) {
    const localeDir = resolve(EMBEDS_DIR, locale);
    if (!isDir(localeDir)) continue;

    for (const slug of readdirSync(localeDir).sort()) {
      const routeDir = resolve(localeDir, slug);
      if (!isDir(routeDir)) continue;
      if (!existsSync(resolve(routeDir, '+page.svelte'))) continue;

      const key = `${locale}/${slug}`;
      const viewport = customViewports[key] || customViewports[slug] || {};
      embeds.push({
        key,
        locale,
        slug,
        path: `/embeds/${locale}/${slug}/`,
        width: viewport.width || DEFAULT_VIEWPORT.width,
        height: viewport.height || DEFAULT_VIEWPORT.height,
      });
    }
  }

  return embeds;
}

function findChrome() {
  const home = process.env.HOME || process.env.USERPROFILE || '';
  const cacheDir = resolve(home, '.cache/puppeteer/chrome');
  if (existsSync(cacheDir)) {
    const versions = readdirSync(cacheDir).sort().reverse();
    for (const version of versions) {
      const bin = resolve(cacheDir, version, 'chrome-linux64/chrome');
      if (existsSync(bin)) return bin;
    }
  }

  for (const name of ['google-chrome-stable', 'google-chrome', 'chromium']) {
    try {
      const path = execFileSync('which', [name], { encoding: 'utf8' }).trim();
      if (path) return path;
    } catch {
      // Binary not found on PATH.
    }
  }

  throw new Error('No Chrome binary found. Install Chrome or Puppeteer.');
}

async function loadPuppeteer() {
  const require = createRequire(import.meta.url);
  try {
    return require('puppeteer-core');
  } catch {
    // Not available from the project; install outside the project below.
  }

  const tmpPkg = '/tmp/node_modules/puppeteer-core';
  if (!existsSync(tmpPkg)) {
    console.log('Installing puppeteer-core to /tmp ...');
    execSync('npm install --prefix /tmp puppeteer-core', { stdio: 'inherit' });
  }
  return require('/tmp/node_modules/puppeteer-core');
}

function startDevServer() {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(
      'npx',
      ['vite', 'dev', '--host', '127.0.0.1', '--port', String(port)],
      {
        cwd: PROJECT_ROOT,
        stdio: ['ignore', 'pipe', 'pipe'],
      }
    );

    let settled = false;
    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill();
      reject(new Error('Dev server did not start within 30s'));
    }, 30000);

    const onData = (chunk) => {
      const text = chunk.toString();
      if (!settled && /Local:\s+http:\/\/127\.0\.0\.1:/.test(text)) {
        settled = true;
        clearTimeout(timeout);
        resolvePromise(child);
      }
    };

    child.stdout.on('data', onData);
    child.stderr.on('data', onData);
    child.on('error', (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      reject(error);
    });
    child.on('exit', (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      reject(
        new Error(`Dev server exited before becoming ready (code ${code})`)
      );
    });
  });
}

const embeds = discoverEmbeds();
if (embeds.length === 0) {
  console.log('No embed pages found.');
  process.exit(0);
}

console.log(
  `Found ${embeds.length} embed(s): ${embeds.map((e) => e.key).join(', ')}`
);

const chromePath = findChrome();
console.log(`Using Chrome: ${chromePath}`);

const puppeteer = await loadPuppeteer();

console.log('Starting dev server ...');
const server = await startDevServer();
console.log(`Dev server ready on port ${port}`);

let browser;
try {
  browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const manifest = [];
  for (const embed of embeds) {
    console.log(
      `  Screenshotting ${embed.key} (${embed.width}x${embed.height}) ...`
    );
    const page = await browser.newPage();
    await page.setViewport({
      width: embed.width,
      height: embed.height,
      deviceScaleFactor: 1,
    });
    await page.goto(`${BASE(port)}${embed.path}`, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    await page.evaluate(() => document.fonts?.ready);

    try {
      await page.waitForSelector('canvas, svg, img, article, main, body', {
        timeout: 10000,
      });
    } catch {
      // The page may still be valid without these common content elements.
    }

    const outPath = resolve(IMAGES_DIR, embed.locale, `${embed.slug}.png`);
    mkdirSync(dirname(outPath), { recursive: true });
    await page.screenshot({ path: outPath, type: 'png' });
    await page.close();

    manifest.push({
      route: embed.path,
      image: relative(PROJECT_ROOT, outPath),
      width: embed.width,
      height: embed.height,
    });
    console.log(`    Saved ${relative(PROJECT_ROOT, outPath)}`);
  }

  const manifestPath = resolve(IMAGES_DIR, 'screenshot-embeds-manifest.json');
  writeFileSync(
    `${manifestPath}.tmp`,
    `${JSON.stringify(manifest, null, 2)}\n`
  );
  rmSync(manifestPath, { force: true });
  renameSync(`${manifestPath}.tmp`, manifestPath);
  console.log(`Wrote ${relative(PROJECT_ROOT, manifestPath)}`);
} finally {
  if (browser) await browser.close();
  server.kill();
  console.log(`Done. Output directory: ${relative(PROJECT_ROOT, IMAGES_DIR)}/`);
}

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import * as cheerio from 'cheerio';
import { globSync } from 'glob';
import { getBasePath } from '@reuters-graphics/graphics-kit-publisher';
import { TestWorkingDirectory } from './utils/twd';

const twd = new TestWorkingDirectory();

// Mock the base URLs the publisher reads from package.json so preview and prod
// builds resolve to known values. Different hosts so that per-mode origin
// extraction is genuinely exercised. (test mode ignores package.json and uses
// the publisher's fixed fake URL.)
const MOCK_PROD_URL = 'https://www.reuters.com/testing/prod/';
const MOCK_PREVIEW_URL = 'https://graphics.thomsonreuters.com/testing/preview/';

// The fully specified base URL injected into each build as `__BASE_URL__`
// (see vite.config.ts), keyed by mode. `test` derives from the publisher's
// constant; `preview`/`prod` come from the mocked package.json values above.
const EXPECTED_BASE_URL = {
  test: getBasePath('test', { trailingSlash: true, rootRelative: false }),
  preview: MOCK_PREVIEW_URL,
  prod: MOCK_PROD_URL,
} as const;

type Mode = keyof typeof EXPECTED_BASE_URL;
const MODES = Object.keys(EXPECTED_BASE_URL) as Mode[];

const distDir = (mode: Mode) => path.join(twd.TWD, `dist-${mode}`);

// The test-mode output backs the general build assertions below.
const DIST = distDir('test');

/**
 * Build the app in a given mode as a fresh `vite build` subprocess (which
 * re-reads the mocked package.json from the TWD), then stash the output in a
 * mode-specific directory so each mode's assertions are order-independent.
 */
const buildMode = (mode: Mode) => {
  const env: NodeJS.ProcessEnv = { ...process.env, TESTING: '', PREVIEW: '' };
  if (mode === 'test') env.TESTING = 'true';
  else if (mode === 'preview') env.PREVIEW = 'true';
  else env.NODE_ENV = 'production';

  execSync('vite build', { cwd: twd.TWD, env, stdio: 'ignore' });

  const out = distDir(mode);
  fs.rmSync(out, { recursive: true, force: true });
  fs.cpSync(path.join(twd.TWD, 'dist'), out, { recursive: true });
};

describe('GraphicsKit build', () => {
  beforeAll(async () => {
    await twd.setup();

    // Mock the base URL sources getBasePath reads from package.json.
    const pkgPath = path.join(twd.TWD, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    pkg.homepage = MOCK_PROD_URL;
    pkg.reuters = { ...(pkg.reuters ?? {}), preview: MOCK_PREVIEW_URL };
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

    for (const mode of MODES) buildMode(mode);
  }, 180_000);

  afterAll(async () => {
    await twd.cleanup();
  });

  it('should build every mode without error', () => {
    for (const mode of MODES) {
      expect(fs.existsSync(path.join(distDir(mode), 'index.html'))).toBe(true);
    }
  });

  it('should build the homepage', () => {
    expect(fs.existsSync(path.join(DIST, 'index.html'))).toBe(true);
  });

  it('should correctly form homepage metadata', () => {
    const $ = cheerio.load(
      fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8')
    );
    expect($('html').attr('lang')).toBe('en');
    expect($('meta[property=og:title]').attr('content')).toBe(
      'Page title for social media'
    );
    expect($('meta[name=description]').attr('content')).toBe(
      'Page description for search'
    );
    expect($('meta[property=og:image]').attr('content')).toBe(
      'https://www.reuters.com/graphics/testing/cdn/images/reuters-graphics.jpg'
    );
    expect($('meta[name=twitter:image]').attr('content')).toBe(
      'https://www.reuters.com/graphics/testing/cdn/images/reuters-graphics.jpg'
    );
    expect($('meta[name=twitter:image:alt]').attr('content')).toBe(
      'Alt text for share image.'
    );
    expect($('link[rel=canonical]').attr('href')).toBe(
      'https://www.reuters.com/graphics/testing/'
    );
  });

  it('should prerender homepage content', () => {
    const $ = cheerio.load(
      fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8')
    );
    expect($('h1').text().trim()).toBe('A Reuters Graphics page');
  });

  it('should build the embed page', () => {
    expect(fs.existsSync(path.join(DIST, 'embeds/en/page/index.html'))).toBe(
      true
    );
  });

  it('should prerender embed page content', () => {
    const $ = cheerio.load(
      fs.readFileSync(path.join(DIST, 'embeds/en/page/index.html'), 'utf-8')
    );
    expect($('h1').text().trim()).toBe('A Reuters Graphics page');
  });

  it('should not include homepage furniture on embed', () => {
    const $ = cheerio.load(
      fs.readFileSync(path.join(DIST, 'embeds/en/page/index.html'), 'utf-8')
    );
    expect($('body').find('footer').length).toBe(0);
  });

  it('should build static assets', () => {
    expect(
      fs.existsSync(path.join(DIST, 'cdn/images/reuters-graphics.jpg'))
    ).toBe(true);
  });

  describe('__BASE_URL__ injection', () => {
    describe.each(MODES)('%s mode', (mode) => {
      const base = EXPECTED_BASE_URL[mode];
      const origin = new URL(base).origin;
      const dist = distDir(mode);

      it('sets the base URL origin in homepage SEO tags', () => {
        const $ = cheerio.load(
          fs.readFileSync(path.join(dist, 'index.html'), 'utf-8')
        );
        expect($('link[rel=canonical]').attr('href')).toBe(base);
        expect($('meta[property=og:url]').attr('content')).toBe(base);
        expect($('meta[name=twitter:domain]').attr('content')).toBe(origin);
      });

      it('sets the base URL origin in embed page SEO tags', () => {
        const embedUrl = new URL('embeds/en/page/', base).href;
        const $ = cheerio.load(
          fs.readFileSync(path.join(dist, 'embeds/en/page/index.html'), 'utf-8')
        );
        expect($('link[rel=canonical]').attr('href')).toBe(embedUrl);
        expect($('meta[property=og:url]').attr('content')).toBe(embedUrl);
        expect($('meta[name=twitter:domain]').attr('content')).toBe(origin);
      });
    });

    it('should replace the __BASE_URL__ token at build time', () => {
      // The Vite `define` should inline the value, leaving no raw token in the
      // built output. Sourcemaps legitimately retain the original source, so
      // only check emitted JS and HTML.
      const built = globSync(['**/*.js', '**/*.html'], {
        cwd: DIST,
        nodir: true,
        absolute: true,
      });
      expect(built.length).toBeGreaterThan(0);
      for (const file of built) {
        expect(fs.readFileSync(file, 'utf-8')).not.toContain('__BASE_URL__');
      }
    });
  });
}, 180_000);

import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import * as cheerio from 'cheerio';
import * as rimraf from 'rimraf';
import { utils } from '@reuters-graphics/graphics-bin';

const DIST = path.join(__dirname, '../dist/');

process.env.TESTING = 'true';

const fetchAndParse = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.text();
};

beforeAll(() => {
  rimraf.sync(DIST);
});

afterAll(() => {
  rimraf.sync(DIST);
});

describe('GraphicsKit preview', () => {
  it('should preview the app without error', async () => {
    try {
      execSync('pnpm publish:preview', { stdio: 'inherit' });
    } catch {
      expect(false).toBe(true);
    }
    expect(true).toBe(true);
  });

  it('should have built the homepage locally', () => {
    expect(fs.existsSync(path.join(DIST, 'index.html'))).toBe(true);
  });

  it('should have published the preview page', async () => {
    const previewUrl = utils.getPkgProp('reuters.preview');
    const html = await fetchAndParse(previewUrl);
    expect(html).toBeTruthy();

    const $ = cheerio.load(html);
    expect($('html').attr('lang')).toBe('en');
    expect($('meta[property=og:title]').attr('content')).toBe(
      'Page title for social media'
    );
    expect($('meta[name=description]').attr('content')).toBe(
      'Page description for search'
    );
    expect($('h1').text().trim()).toBe('A Reuters Graphics page');
  });
}, 90_000);

import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import * as cheerio from 'cheerio';
import * as rimraf from 'rimraf';
import { utils, S3Client } from '@reuters-graphics/graphics-bin';

const DIST = path.join(__dirname, '../dist/');

process.env.TESTING = 'true';

const fetchAndParse = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    console.log('ERROR FOR URL', url);
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.text();
};

beforeAll(() => {
  rimraf.sync(DIST);
});

afterAll(async () => {
  rimraf.sync(DIST);

  const s3 = new S3Client();
  const previewUrl = utils.getPkgProp('reuters.preview');
  await s3.dangerouslyDeleteS3Directory(
    previewUrl.replace('https://graphics.thomsonreuters.com/', ''),
    true
  );
  utils.setPkgProp('reuters.preview', '');
});

describe('GraphicsKit preview', () => {
  it('should preview the app without error', async () => {
    const originalTesting = process.env.TESTING;
    const originalVitest = process.env.VITEST;
    delete process.env.TESTING;
    delete process.env.VITEST;
    try {
      execSync('pnpm publish:preview', { stdio: 'inherit' });
    } catch {
      expect(false).toBe(true);
    }
    process.env.TESTING = originalTesting;
    process.env.VITEST = originalVitest;
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

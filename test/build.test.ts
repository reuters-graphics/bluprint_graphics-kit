import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import * as cheerio from 'cheerio';
import * as rimraf from 'rimraf';

const DIST = path.join(__dirname, '../dist/');

process.env.TESTING = 'true';

beforeAll(() => {
  rimraf.sync(DIST);
});

afterAll(() => {
  rimraf.sync(DIST);
});

describe('GraphicsKit build', () => {
  it('should build the app without error', async () => {
    try {
      execSync('vite build', { stdio: 'inherit' });
    } catch {
      expect(false).toBe(true);
    }
    expect(true).toBe(true);
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
      'https://graphics.reuters.com/test/testing/cdn/images/reuters-graphics.jpg'
    );
    expect($('meta[name=twitter:image]').attr('content')).toBe(
      'https://graphics.reuters.com/test/testing/cdn/images/reuters-graphics.jpg'
    );
    expect($('meta[name=twitter:image:alt]').attr('content')).toBe(
      'Alt text for share image.'
    );
    expect($('link[rel=canonical]').attr('href')).toBe(
      'https://graphics.reuters.com/test/testing/'
    );
  });

  it('should prerender homepage content', () => {
    const $ = cheerio.load(
      fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8')
    );
    expect($('h1').text().trim()).toBe('Reuters Graphics Interactive');
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
    expect($('h1').text().trim()).toBe('Reuters Graphics Interactive');
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
}, 90_000);

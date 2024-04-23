const expect = require('expect.js');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const rimraf = require('rimraf');
const cheerio = require('cheerio');

const DIST = path.join(__dirname, '../dist/');

process.env.TESTING = true;

describe('GraphicsKit build', function() {
  this.timeout(90000);

  before(function() {
    rimraf.sync(DIST);
  });

  after(function() {
    rimraf.sync(DIST);
  });

  it('should build the app without error', async function() {
    try {
      execSync('vite build', { stdio: 'inherit', stdout: 'inherit' });
    } catch {
      expect(false).to.be(true);
    }
    expect(true).to.be(true);
  });
  it('should build the homepage', async function() {
    expect(fs.existsSync(path.join(DIST, 'index.html'))).to.be(true);
  });
  it('should correctly form homepage metadata', async function() {
    const $ = cheerio.load(fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8'));
    expect($('html').attr('lang')).to.be('en');
    expect($('meta[property=og:title]').attr('content')).to.be('My page title for Twitter');
    expect($('meta[name=description]').attr('content')).to.be('My page description for Google');
    expect($('meta[property=og:image]').attr('content')).to.be('https://graphics.reuters.com/test/testing/cdn/images/reuters-graphics.jpg');
    expect($('meta[name=twitter:image]').attr('content')).to.be('https://graphics.reuters.com/test/testing/cdn/images/reuters-graphics.jpg');
    expect($('meta[name=twitter:image:alt]').attr('content')).to.be('Alt text for share image');
    expect($('link[rel=canonical]').attr('href')).to.be('https://graphics.reuters.com/test/testing/');
  });
  it('should prerender homepage content', async function() {
    const $ = cheerio.load(fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8'));
    expect($('h1').text().trim()).to.be('Reuters Graphics Interactive');
  });
  it('should build the embed page', async function() {
    expect(fs.existsSync(path.join(DIST, 'embeds/en/page/index.html'))).to.be(true);
  });
  it('should prerender embed page content', async function() {
    const $ = cheerio.load(fs.readFileSync(path.join(DIST, 'embeds/en/page/index.html'), 'utf-8'));
    expect($('h1').text().trim()).to.be('Reuters Graphics Interactive');
  });
  it('should not include homepage furniture on embed', async function() {
    const $ = cheerio.load(fs.readFileSync(path.join(DIST, 'embeds/en/page/index.html'), 'utf-8'));
    expect($('body').find('footer').length).to.be(0);
  });
  it('should build static assets', async function() {
    expect(fs.existsSync(path.join(DIST, 'cdn/images/reuters-graphics.jpg'))).to.be(true);
  });
});

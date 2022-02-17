const expect = require('expect.js');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const rimraf = require('rimraf');

const DIST = path.join(__dirname, '../dist/');
const BUILT_INDEX = path.join(DIST, 'index.html');

describe('GraphicsKit', function() {
  this.timeout(90000);

  before(function() {
    rimraf.sync(DIST);
  });

  after(function() {
    rimraf.sync(DIST);
  });

  it('It should build the project', async function() {
    try {
      execSync('svelte-kit build');
    } catch {
      expect(false).to.be(true);
    }
    expect(fs.existsSync(BUILT_INDEX)).to.be(true);
  });
});

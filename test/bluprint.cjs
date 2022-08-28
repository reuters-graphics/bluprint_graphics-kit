const expect = require('expect.js');
const mock = require('mock-fs');
const path = require('path');
const bluprint = require('@reuters-graphics/bluprint');
const os = require('os');
const fs = require('fs');
const prompts = require('prompts');

const userConfigPath = path.join(os.homedir(), '.bluprintrc');

const resolvePath = (filePath) => path.join(process.cwd(), filePath);

describe('GraphicsKit bluprint', function() {
  this.timeout(90000);

  beforeEach(function() {
    const userConfig = {
      bluprints: {
        'graphics-kit': {
          user: 'reuters-graphics',
          project: 'bluprint_graphics-kit',
        },
      },
    };

    mock({
      [userConfigPath]: JSON.stringify(userConfig),
    });

    prompts.inject({
      projectName: 'test-project',
    });
  });

  afterEach(function() {
    mock.restore();
  });

  it('Creates a new project from the bluprint', async function() {
    await bluprint.start('graphics-kit');

    expect(fs.existsSync(resolvePath('PROJECT_README.md'))).to.be(false);
    expect(fs.existsSync(resolvePath('README.md'))).to.be(true);

    const pkg = JSON.parse(fs.readFileSync(resolvePath('package.json'), 'utf-8'));
    expect(pkg.name).to.be('test-project');
  });
});

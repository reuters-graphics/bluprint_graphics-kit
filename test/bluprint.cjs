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
      [path.join(os.homedir(), '.aws/credentials')]: '[default]\r\naws_access_key_id=SOMETHING123\r\naws_secret_access_key=SOMETHINGELSE123',
      [path.join(os.homedir(), '.reuters-graphics/profile.json')]: JSON.stringify({
        name: 'Jon Doe',
        email: 'an-email@thomsonreuters.com',
        github: {
          email: 'an-email@email.com',
        },
        url: 'https://www.twitter.com',
        desk: 'london',
      }),
      [path.join(os.homedir(), '.reuters-graphics/secrets.json')]: JSON.stringify({
        trelloApiKey: 'APIKEY',
        trelloApiToken: 'APITOKEN',
      }),
      [path.join(os.homedir(), '.reuters-graphics/graphics-server.json')]: JSON.stringify({
        username: '0123456',
        password: 'PASSWORD',
        apiKey: 'APIKEY123456789',
      }),
    });
  });

  afterEach(function() {
    mock.restore();
  });

  it('Creates a new project from the bluprint', async function() {
    prompts.inject(['test-project', 'na', false]);

    await bluprint.start('graphics-kit');

    expect(fs.existsSync(resolvePath('PROJECT_README.md'))).to.be(false);
    expect(fs.existsSync(resolvePath('README.md'))).to.be(true);
    expect(fs.existsSync(resolvePath('package.json'))).to.be(true);

    const pkg = JSON.parse(fs.readFileSync(resolvePath('package.json'), 'utf-8'));
    console.log('package', pkg);
    expect(pkg.name).to.be('test-project');
  });
});

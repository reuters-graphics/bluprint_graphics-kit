import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import mock from 'mock-fs';
import path from 'path';
import os from 'os';
import fs from 'fs';
import prompts from 'prompts';
import bluprint from '@reuters-graphics/bluprint';

const userConfigPath = path.join(os.homedir(), '.bluprintrc');

const resolvePath = (filePath: string) => path.join(process.cwd(), filePath);

beforeEach(() => {
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
    [path.join(os.homedir(), '.aws/credentials')]:
      '[default]\r\naws_access_key_id=SOMETHING123\r\naws_secret_access_key=SOMETHINGELSE123',
    [path.join(os.homedir(), '.reuters-graphics/profile.json')]: JSON.stringify(
      {
        name: 'Jon Doe',
        email: 'an-email@thomsonreuters.com',
        github: {
          email: 'an-email@email.com',
        },
        url: 'https://www.twitter.com',
        desk: 'london',
      }
    ),
    [path.join(os.homedir(), '.reuters-graphics/secrets.json')]: JSON.stringify(
      {
        trelloApiKey: 'APIKEY',
        trelloApiToken: 'APITOKEN',
      }
    ),
    [path.join(os.homedir(), '.reuters-graphics/graphics-server.json')]:
      JSON.stringify({
        username: '0123456',
        password: 'PASSWORD',
        apiKey: 'APIKEY123456789',
      }),
  });
});

afterEach(() => {
  mock.restore();
});

describe('GraphicsKit bluprint', () => {
  it('Creates a new project from the bluprint', async () => {
    // Mock user inputs
    prompts.inject(['test-project', 'na', false]);

    // Run the bluprint command
    await bluprint.start('graphics-kit');

    // Validate file system structure
    expect(fs.existsSync(resolvePath('PROJECT_README.md'))).toBe(false);
    expect(fs.existsSync(resolvePath('README.md'))).toBe(true);
    expect(fs.existsSync(resolvePath('test/bluprint.cjs'))).toBe(false);
    expect(fs.existsSync(resolvePath('package.json'))).toBe(true);

    const pkg = JSON.parse(
      fs.readFileSync(resolvePath('package.json'), 'utf-8')
    );
    expect(pkg.name).toBe('test-project');
  });
}, 90_000);

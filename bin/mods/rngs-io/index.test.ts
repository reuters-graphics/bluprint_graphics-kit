import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import { TestWorkingDirectory } from '$test/utils/twd';
import fs from 'fs';
import path from 'path';
import { unconfigRngsIo } from '.';
import dedent from 'dedent';

process.env.TESTING = 'true';

const twd = new TestWorkingDirectory();

describe('Mods: unconfig-rngs-io', () => {
  beforeAll(async () => {
    await twd.setup();
  });

  afterAll(async () => {
    await twd.cleanup();
  });

  it('should overwrite layout.ts', async () => {
    unconfigRngsIo();

    expect(fs.existsSync(path.join(twd.TWD, 'pages/+layout.ts'))).toBe(true);
    expect(fs.readFileSync(path.join(twd.TWD, 'pages/+layout.ts'), 'utf8'))
      .toMatch(dedent`import enContent from '$locales/en/content.json';

    export const load: LayoutLoad = async () => {
      return { content: enContent.story };
    };
    `);
  });
});

import { describe, it, beforeAll, afterAll } from 'vitest';
import { TestWorkingDirectory } from '$test/utils/twd';

const twd = new TestWorkingDirectory();

beforeAll(async () => {
  await twd.setup();
});

afterAll(async () => {
  await twd.cleanup();
});

describe('Mods: Project type', () => {
  it('should work', () => {
    console.log('CHECKS');
  });
});

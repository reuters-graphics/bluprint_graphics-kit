import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import { TestWorkingDirectory } from '$test/utils/twd';
import fs from 'fs';
import path from 'path';
import { makeAiEmbed } from '.';

const twd = new TestWorkingDirectory();

beforeAll(async () => {
  await twd.setup();
});

afterAll(async () => {
  await twd.cleanup();
});

describe('Mods: make-ai-embed', () => {
  it('should make embed source page', async () => {
    const aiComponent = path.join(twd.TWD, 'src/lib/ai2svelte/map.svelte');
    fs.copyFileSync(
      path.join(twd.TWD, 'src/lib/ai2svelte/ai-chart.svelte'),
      aiComponent
    );

    await makeAiEmbed(aiComponent, 'en');

    expect(
      fs.existsSync(path.join(twd.TWD, 'pages/embeds/en/map/+page.svelte'))
    ).toBe(true);
  });
});

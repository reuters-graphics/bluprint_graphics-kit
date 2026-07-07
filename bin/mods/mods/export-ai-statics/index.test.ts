import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { createTestContext } from '$test/utils/modContext';

// Stub the native Illustrator export so tests run without Illustrator: each
// method just writes a placeholder file at the requested path.
vi.mock('@reuters-graphics/illustrator-exports', () => {
  const touch = (p: string) => {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, 'stub');
  };
  return {
    AiExport: class {
      saveEPS(p: string) {
        touch(p);
      }
      exportJPG(p: string) {
        touch(p);
      }
    },
  };
});

process.env.TESTING = 'true';

describe('Mods: export-ai-statics', () => {
  let root: string;
  let aiFile: string;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-statics-'));
    fs.mkdirSync(path.join(root, 'project-files'), { recursive: true });
    aiFile = path.join(root, 'project-files', 'My Chart.ai');
    fs.writeFileSync(aiFile, 'ai');
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('exports EPS + JPG and mirrors the JPG into statics', async () => {
    const { exportAiStatics } = await import('.');
    await exportAiStatics(createTestContext(root, [aiFile, 'en']));

    expect(
      fs.existsSync(path.join(root, 'media-assets/en/my-chart/graphic.eps'))
    ).toBe(true);
    expect(
      fs.existsSync(path.join(root, 'media-assets/en/my-chart/graphic.jpg'))
    ).toBe(true);
    expect(
      fs.existsSync(
        path.join(root, 'src/statics/images/embeds/en/my-chart.jpg')
      )
    ).toBe(true);
  });

  it('dry run writes nothing', async () => {
    const { exportAiStatics } = await import('.');
    await exportAiStatics(
      createTestContext(root, [aiFile, 'en'], { dryRun: true })
    );

    expect(fs.existsSync(path.join(root, 'media-assets'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'src/statics'))).toBe(false);
  });
});

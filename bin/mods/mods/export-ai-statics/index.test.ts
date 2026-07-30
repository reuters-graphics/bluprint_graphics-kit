import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { createTestContext } from '$test/utils/modContext';

/**
 * Leading bytes of a JPEG/JFIF header. Deliberately real binary — invalid UTF-8,
 * so a stub written as text would hide the corruption this mod once caused.
 */
const JPEG_HEADER = Buffer.from([
  0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46,
]);

// Stub the native Illustrator export so tests run without Illustrator: each
// method just writes a placeholder file at the requested path.
vi.mock('@reuters-graphics/illustrator-exports', () => {
  const touch = (p: string, contents: Buffer | string) => {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, contents);
  };
  return {
    AiExport: class {
      saveEPS(p: string) {
        touch(p, 'stub');
      }
      exportJPG(p: string) {
        touch(p, JPEG_HEADER);
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

  it('mirrors the JPG into statics without corrupting its bytes', async () => {
    const { exportAiStatics } = await import('.');
    await exportAiStatics(createTestContext(root, [aiFile, 'en']));

    const mirrored = fs.readFileSync(
      path.join(root, 'src/statics/images/embeds/en/my-chart.jpg')
    );
    expect(mirrored.equals(JPEG_HEADER)).toBe(true);
    // Guards the specific regression: a UTF-8 round trip rewrites the JFIF
    // marker as the U+FFFD replacement sequence (ef bf bd).
    expect(mirrored.subarray(0, 4).toString('hex')).toBe('ffd8ffe0');
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

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import sharp from 'sharp';
import * as cheerio from 'cheerio';
import { checkEmbedShareImages } from '../bin/share-images';

const writeImage = async (filePath: string, color: string) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  await sharp({
    create: {
      width: 1200,
      height: 628,
      channels: 4,
      background: color,
    },
  })
    .jpeg()
    .toFile(filePath);
};

const html = (imageUrl: string) => `<!doctype html>
<html>
  <head>
    <link rel="canonical" href="https://www.reuters.com/graphics/testing/embeds/en/page/" />
    <meta property="og:url" content="https://www.reuters.com/graphics/testing/embeds/en/page/" />
    <meta property="og:image" content="${imageUrl}" />
    <meta name="twitter:image" content="${imageUrl}" />
  </head>
  <body>Embed</body>
</html>`;

describe('embed share image checks', () => {
  let root: string;
  let log: Pick<Console, 'log' | 'warn' | 'error'>;

  beforeEach(async () => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'share-images-'));
    log = {
      log: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };

    await writeImage(
      path.join(root, 'src/statics/images/reuters-graphics.jpg'),
      '#f5f5f5'
    );
    fs.mkdirSync(path.join(root, 'dist/embeds/en/page'), { recursive: true });
    fs.writeFileSync(
      path.join(root, 'dist/embeds/en/page/index.html'),
      html('https://www.reuters.com/graphics/testing/cdn/images/custom.jpg')
    );
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('uses a valid custom og:image and writes a publisher preview image', async () => {
    await writeImage(path.join(root, 'dist/cdn/images/custom.jpg'), '#ff0000');

    const result = await checkEmbedShareImages({ root, log });

    expect(result.fallbackCount).toBe(0);
    expect(result.results[0]).toMatchObject({
      embedId: 'embeds/en/page',
      source: 'metadata',
      fallback: false,
    });
    expect(
      fs.existsSync(path.join(root, 'dist/embeds/en/page/_gfxpreview.png'))
    ).toBe(true);
    expect(log.warn).not.toHaveBeenCalled();
  });

  it('falls back to the placeholder when the metadata image is missing', async () => {
    const result = await checkEmbedShareImages({ root, log });

    expect(result.fallbackCount).toBe(1);
    expect(result.results[0]).toMatchObject({
      source: 'fallback',
      fallback: true,
      metadataUpdated: true,
    });
    expect(result.results[0].reason).toContain('File not found');
    expect(
      fs.existsSync(path.join(root, 'dist/embeds/en/page/_gfxpreview.png'))
    ).toBe(true);
    expect(log.warn).toHaveBeenCalledWith(
      expect.stringContaining('Share image fallback for embeds/en/page')
    );
  });

  it('falls back when image compilation/decoding fails', async () => {
    fs.mkdirSync(path.join(root, 'dist/cdn/images'), { recursive: true });
    fs.writeFileSync(
      path.join(root, 'dist/cdn/images/custom.jpg'),
      'not an image'
    );

    const result = await checkEmbedShareImages({ root, log });

    expect(result.fallbackCount).toBe(1);
    expect(result.results[0].reason).toContain('Could not read image');
  });

  it('updates embed metadata to the placeholder only for fallback cases', async () => {
    await checkEmbedShareImages({ root, log });

    const $ = cheerio.load(
      fs.readFileSync(
        path.join(root, 'dist/embeds/en/page/index.html'),
        'utf-8'
      )
    );
    expect($('meta[property="og:image"]').attr('content')).toBe(
      'https://www.reuters.com/graphics/testing/cdn/images/reuters-graphics.jpg'
    );
    expect($('meta[name="twitter:image"]').attr('content')).toBe(
      'https://www.reuters.com/graphics/testing/cdn/images/reuters-graphics.jpg'
    );
    expect(
      $('meta[name="reuters:share-image:fallback"]').attr('content')
    ).toContain('File not found');
  });

  it('writes an observable manifest with fallback details', async () => {
    const result = await checkEmbedShareImages({ root, log });
    const manifest = JSON.parse(fs.readFileSync(result.manifestPath, 'utf-8'));

    expect(manifest.placeholder).toBe(
      'src/statics/images/reuters-graphics.jpg'
    );
    expect(manifest.embeds[0]).toMatchObject({
      embedId: 'embeds/en/page',
      source: 'fallback',
      fallback: true,
      htmlPath: 'dist/embeds/en/page/index.html',
      previewPath: 'dist/embeds/en/page/_gfxpreview.png',
    });
    expect(manifest.embeds[0].remediation).toContain(
      'Create or restore the intended share image'
    );
  });

  it('can fail strict early preflight while non-strict builds remain graceful', async () => {
    await expect(
      checkEmbedShareImages({ root, log, strict: true })
    ).rejects.toThrow(/Share image preflight failed for 1 embed/);

    fs.rmSync(path.join(root, 'dist/embeds/en/page/_gfxpreview.png'), {
      force: true,
    });
    fs.writeFileSync(
      path.join(root, 'dist/embeds/en/page/index.html'),
      html('https://www.reuters.com/graphics/testing/cdn/images/custom.jpg')
    );

    await expect(checkEmbedShareImages({ root, log })).resolves.toMatchObject({
      fallbackCount: 1,
    });
  });

  it('keeps strict preflight failing after a graceful fallback build', async () => {
    await checkEmbedShareImages({ root, log });

    await expect(
      checkEmbedShareImages({ root, log, strict: true })
    ).rejects.toThrow(/Share image preflight failed for 1 embed/);
  });

  it('preserves normal publishing output when no fallback is needed', async () => {
    await writeImage(path.join(root, 'dist/cdn/images/custom.jpg'), '#ff0000');
    await checkEmbedShareImages({ root, log });

    const $ = cheerio.load(
      fs.readFileSync(
        path.join(root, 'dist/embeds/en/page/index.html'),
        'utf-8'
      )
    );
    expect($('meta[property="og:image"]').attr('content')).toBe(
      'https://www.reuters.com/graphics/testing/cdn/images/custom.jpg'
    );
  });
});

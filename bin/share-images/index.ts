import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import * as cheerio from 'cheerio';
import sharp from 'sharp';
import type { Plugin } from 'vite';

const VALID_IMAGE_FORMATS = new Set(['.jpg', '.jpeg', '.png', '.gif']);

export const DEFAULT_SHARE_IMAGE_PLACEHOLDER =
  'src/statics/images/reuters-graphics.jpg';

export type ShareImageSource = 'metadata' | 'fallback';

export interface ShareImageResult {
  embedId: string;
  htmlPath: string;
  previewPath: string;
  source: ShareImageSource;
  sourcePath?: string;
  fallback: boolean;
  reason?: string;
  metadataUpdated: boolean;
  remediation?: string;
}

export interface ShareImageCheckOptions {
  root?: string;
  dist?: string;
  placeholder?: string;
  strict?: boolean;
  log?: Pick<Console, 'log' | 'warn' | 'error'>;
}

const toPosix = (filePath: string) => filePath.split(path.sep).join('/');

const exists = (filePath: string) => fs.existsSync(filePath);

const isValidImageType = (filePath: string) =>
  VALID_IMAGE_FORMATS.has(path.extname(filePath).toLowerCase());

const validateReadableImage = async (filePath: string) => {
  if (!exists(filePath)) return `File not found: ${filePath}`;
  if (!isValidImageType(filePath)) {
    return `Unsupported image type: ${path.basename(filePath)}`;
  }
  try {
    await sharp(filePath).metadata();
    return null;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return `Could not read image ${filePath}: ${message}`;
  }
};

const getEmbedHtmlPaths = (distDir: string) => {
  const embedsRoot = path.join(distDir, 'embeds');
  if (!exists(embedsRoot)) return [];

  const htmlPaths: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(entryPath);
      else if (entry.name === 'index.html') htmlPaths.push(entryPath);
    }
  };

  walk(embedsRoot);
  return htmlPaths.sort();
};

const getMetadata = (html: string) => {
  const $ = cheerio.load(html);
  return {
    $,
    canonicalUrl:
      $('link[rel="canonical"]').attr('href') ||
      $('meta[property="og:url"]').attr('content') ||
      '',
    ogImageUrl: $('meta[property="og:image"]').attr('content') || '',
  };
};

const resolveMetadataImagePath = (
  htmlPath: string,
  canonicalUrl: string,
  imageUrl: string
) => {
  if (!imageUrl) return { error: 'No og:image metadata found.' };
  if (!canonicalUrl) return { error: 'No canonical URL metadata found.' };

  try {
    const pagePath = new URL(canonicalUrl).pathname.replace(/index\.html$/, '');
    const imagePath = new URL(imageUrl).pathname;
    const relativeImagePath = path.posix.relative(pagePath, imagePath);
    return {
      imagePath: path.join(path.dirname(htmlPath), relativeImagePath),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { error: `Could not resolve og:image URL: ${message}` };
  }
};

const writePngPreview = async (sourcePath: string, previewPath: string) => {
  fs.mkdirSync(path.dirname(previewPath), { recursive: true });
  await sharp(sourcePath).png().toFile(previewPath);
};

const getPlaceholderUrl = (
  htmlPath: string,
  canonicalUrl: string,
  placeholderDistPath: string
) => {
  if (!canonicalUrl) return '';
  const relativePlaceholderPath = toPosix(
    path.relative(path.dirname(htmlPath), placeholderDistPath)
  );
  try {
    return new URL(relativePlaceholderPath, canonicalUrl).href;
  } catch {
    return '';
  }
};

const upsertMeta = (
  $: cheerio.CheerioAPI,
  selector: string,
  attrs: Record<string, string>,
  valueAttr: 'content' | 'href',
  value: string
) => {
  const existing = $(selector).first();
  if (existing.length) {
    existing.attr(valueAttr, value);
    return;
  }
  $('head').append('\n' + $('<meta>').attr({ ...attrs, [valueAttr]: value }));
};

const updateHtmlFallbackMetadata = (
  htmlPath: string,
  placeholderUrl: string,
  reason: string
) => {
  if (!placeholderUrl) return false;
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const { $ } = getMetadata(html);

  upsertMeta(
    $,
    'meta[property="og:image"]',
    { property: 'og:image' },
    'content',
    placeholderUrl
  );
  upsertMeta(
    $,
    'meta[name="twitter:image"]',
    { name: 'twitter:image' },
    'content',
    placeholderUrl
  );
  if (!$('meta[name="twitter:image:alt"]').length) {
    $('head').append(
      '\n' +
        $('<meta>').attr({
          name: 'twitter:image:alt',
          content: 'Reuters Graphics placeholder image.',
        })
    );
  }
  upsertMeta(
    $,
    'meta[name="reuters:share-image:fallback"]',
    { name: 'reuters:share-image:fallback' },
    'content',
    reason
  );

  fs.writeFileSync(htmlPath, $.html());
  return true;
};

const remediation = (placeholder: string) =>
  `Create or restore the intended share image, make sure the page's og:image points to a readable JPG/PNG/GIF in src/statics, or replace the fallback placeholder (${placeholder}) before publishing.`;

export const checkEmbedShareImages = async ({
  root = process.cwd(),
  dist = 'dist',
  placeholder = DEFAULT_SHARE_IMAGE_PLACEHOLDER,
  strict = false,
  log = console,
}: ShareImageCheckOptions = {}) => {
  const distDir = path.resolve(root, dist);
  const placeholderPath = path.resolve(root, placeholder);
  const placeholderDistPath = path.join(
    distDir,
    'cdn',
    path.relative(path.resolve(root, 'src/statics'), placeholderPath)
  );
  const manifestPath = path.join(distDir, 'share-images-manifest.json');
  const htmlPaths = getEmbedHtmlPaths(distDir);

  const placeholderProblem = await validateReadableImage(placeholderPath);
  if (placeholderProblem) {
    throw new Error(
      `Share-image fallback placeholder is unavailable. ${placeholderProblem}`
    );
  }

  const results: ShareImageResult[] = [];

  for (const htmlPath of htmlPaths) {
    const embedId = toPosix(path.relative(distDir, path.dirname(htmlPath)));
    const previewPath = path.join(path.dirname(htmlPath), '_gfxpreview.png');
    let sourcePath = '';
    let source: ShareImageSource = 'metadata';
    let fallbackReason = '';
    let metadataUpdated = false;

    const html = fs.readFileSync(htmlPath, 'utf-8');
    const { $, canonicalUrl, ogImageUrl } = getMetadata(html);
    const existingFallback = $('meta[name="reuters:share-image:fallback"]')
      .attr('content')
      ?.trim();

    if (existingFallback) fallbackReason = existingFallback;
    else {
      const resolved = resolveMetadataImagePath(
        htmlPath,
        canonicalUrl,
        ogImageUrl
      );
      if (resolved.error) fallbackReason = resolved.error;
      else if (resolved.imagePath) {
        const problem = await validateReadableImage(resolved.imagePath);
        if (problem) fallbackReason = problem;
        else sourcePath = resolved.imagePath;
      }
    }

    if (fallbackReason) {
      source = 'fallback';
      sourcePath = placeholderPath;
      await writePngPreview(placeholderPath, previewPath);

      const html = fs.readFileSync(htmlPath, 'utf-8');
      const { canonicalUrl } = getMetadata(html);
      const placeholderUrl = getPlaceholderUrl(
        htmlPath,
        canonicalUrl,
        placeholderDistPath
      );
      metadataUpdated = updateHtmlFallbackMetadata(
        htmlPath,
        placeholderUrl,
        fallbackReason
      );

      results.push({
        embedId,
        htmlPath,
        previewPath,
        source,
        sourcePath,
        fallback: true,
        reason: fallbackReason,
        metadataUpdated,
        remediation: remediation(placeholder),
      });
      continue;
    }

    await writePngPreview(sourcePath, previewPath);
    results.push({
      embedId,
      htmlPath,
      previewPath,
      source,
      sourcePath,
      fallback: false,
      metadataUpdated: false,
    });
  }

  fs.mkdirSync(distDir, { recursive: true });
  fs.writeFileSync(
    manifestPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        placeholder,
        embeds: results.map((result) => ({
          ...result,
          htmlPath: path.relative(root, result.htmlPath),
          previewPath: path.relative(root, result.previewPath),
          sourcePath:
            result.sourcePath ?
              path.relative(root, result.sourcePath)
            : undefined,
        })),
      },
      null,
      2
    )
  );

  const fallbacks = results.filter((result) => result.fallback);
  for (const fallback of fallbacks) {
    log.warn(
      `Share image fallback for ${fallback.embedId}: ${fallback.reason}\n` +
        `  Wrote ${path.relative(root, fallback.previewPath)} from ${placeholder}.\n` +
        `  ${fallback.remediation}`
    );
  }

  if (strict && fallbacks.length) {
    throw new Error(
      `Share image preflight failed for ${fallbacks.length} embed(s). See ${path.relative(
        root,
        manifestPath
      )} for details.`
    );
  }

  return {
    manifestPath,
    results,
    fallbackCount: fallbacks.length,
  };
};

export const shareImagePreviewPlugin = (): Plugin => ({
  name: 'bluprint-share-image-preview',
  apply: 'build',
  closeBundle: async () => {
    await checkEmbedShareImages({
      strict: process.env.SHARE_IMAGES_STRICT === 'true',
    });
  },
});

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  checkEmbedShareImages({
    strict: process.argv.includes('--strict'),
  }).catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}

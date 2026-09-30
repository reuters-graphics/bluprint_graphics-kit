import fs from 'fs';
import path from 'path';
import c from 'picocolors';
import dedent from 'dedent';
import { globSync } from 'glob';
import slugify from '@sindresorhus/slugify';
import { note } from '@reuters-graphics/clack';
import { moduleDir } from '../../_core/dirname';
import { templateCopyOp } from '../../_core/template';
import { hasMarker } from '../../_core/markers';
import { LOCALES } from '../../_core/constants';
import type { ModContext } from '../../_core/context';
import type { FileOp } from '../../_core/plan';

const templatesDir = path.join(moduleDir(import.meta.url), 'templates');
const EMBED_DIR = 'pages/embeds/[locale]/[slug]';
const SLUG_PLACEHOLDER = 'embed-name';

type EmbedKind = 'ai2svelte' | 'blank';

/**
 * Why `slug` can't be used for a new embed in `locale`, or `undefined` if it
 * can. Doubles as the slug prompt's validator.
 */
export const slugError = (root: string, locale: string, slug = '') => {
  if (!slug) return `Enter a slug, e.g. ${SLUG_PLACEHOLDER}`;
  if (slugify(slug) !== slug)
    return `Use lowercase letters, numbers and hyphens, e.g. ${SLUG_PLACEHOLDER}`;
  // The project-type mod owns pages/embeds/en/page and detects pages+ by it.
  if (locale === 'en' && slug === 'page')
    return '"page" is reserved for the embeddable version of the homepage';
  if (fs.existsSync(path.join(root, 'pages/embeds', locale, slug)))
    return `An embed already exists at pages/embeds/${locale}/${slug}`;
};

const promptForLocale = (ctx: ModContext) =>
  ctx.select({
    message: "What's the language for this graphic embed?",
    initialValue: 'en',
    options: LOCALES,
  });

const promptForKind = async (
  ctx: ModContext,
  hasAiComponents: boolean
): Promise<EmbedKind> => {
  if (!hasAiComponents) {
    ctx.log.info(
      'No ai2svelte components in src/lib/ai2svelte/, so making a blank embed.'
    );
    return 'blank';
  }
  return ctx.select<EmbedKind>({
    message: 'What kind of embed do you want to make?',
    options: [
      {
        value: 'ai2svelte',
        label: 'ai2svelte graphic',
        hint: 'from src/lib/ai2svelte/',
      },
      {
        value: 'blank',
        label: 'Blank',
        hint: 'wire in your own component',
      },
    ],
  });
};

const done = (ctx: ModContext, embedDir: string, message: string) => {
  if (process.env.TESTING || ctx.dryRun) return;
  ctx.log.info(`Embed created: ${path.relative(ctx.root, embedDir)}/`);
  note(message);
};

export const makeAiEmbed = async (
  ctx: ModContext,
  args: {
    kind?: EmbedKind;
    aiComponent?: string;
    locale?: string;
    slug?: string;
  } = {}
) => {
  if (hasMarker(ctx.root, 'blog')) {
    ctx.log.error(
      'This project has been converted to a blog — embed pages no longer apply.'
    );
    return;
  }

  const aiComponents = globSync('*.svelte', {
    cwd: path.join(ctx.root, 'src/lib/ai2svelte'),
    absolute: true,
  });
  const kind =
    args.kind ??
    (args.aiComponent ? 'ai2svelte' : (
      await promptForKind(ctx, aiComponents.length > 0)
    ));

  if (kind === 'ai2svelte') {
    const aiComponent =
      args.aiComponent ??
      (await ctx.select({
        message:
          'Which of these ai2svelte components do you want to create an embed for?',
        options: aiComponents.map((filePath) => ({
          label: path.basename(filePath, '.svelte'),
          value: filePath,
        })),
      }));
    const locale = args.locale ?? (await promptForLocale(ctx));

    if (!fs.existsSync(aiComponent)) {
      ctx.log.error(`ai2svelte component not found: ${aiComponent}`);
      return;
    }

    const aiSlug = slugify(path.basename(aiComponent, '.svelte'));
    const error = slugError(ctx.root, locale, aiSlug);
    if (error) {
      ctx.log.error(error);
      return;
    }

    const pathReplace = { '[locale]': locale, '[slug]': aiSlug };
    ctx.apply([
      templateCopyOp(templatesDir, ctx.root, `${EMBED_DIR}/+page.svelte`, {
        replace: [
          { match: 'ai-chart.svelte', replace: path.basename(aiComponent) },
        ],
        pathReplace,
      }),
      templateCopyOp(templatesDir, ctx.root, `${EMBED_DIR}/+page.server.ts`, {
        pathReplace,
      }),
    ]);

    done(
      ctx,
      path.join(ctx.root, 'pages/embeds', locale, aiSlug),
      dedent`Be sure to add this graphic to your ${c.cyan('"embeds"')} ArchieML
      doc and export AI statics for it before publishing.
      `
    );
    return;
  }

  const locale = args.locale ?? (await promptForLocale(ctx));
  const slug =
    args.slug ??
    (await ctx.text({
      message: "What's the slug for this embed?",
      placeholder: SLUG_PLACEHOLDER,
      validate: (value) => slugError(ctx.root, locale, value),
    }));

  const error = slugError(ctx.root, locale, slug);
  if (error) {
    ctx.log.error(error);
    return;
  }

  const blankDir = path.join(templatesDir, 'blank');
  const pathReplace = { '[locale]': locale, '[slug]': slug };
  const previewImg = `src/statics/images/embeds/${locale}/${slug}.jpg`;
  const placeholderImg = !fs.existsSync(path.join(ctx.root, previewImg));

  const ops: FileOp[] = [
    templateCopyOp(blankDir, ctx.root, `${EMBED_DIR}/+page.svelte`, {
      replace: [
        { match: '[locale]', replace: locale },
        { match: '[slug]', replace: slug },
      ],
      pathReplace,
    }),
    templateCopyOp(templatesDir, ctx.root, `${EMBED_DIR}/+page.server.ts`, {
      pathReplace,
    }),
  ];
  // A placeholder preview image keeps the build from failing on a missing one.
  if (placeholderImg) {
    ops.push({
      kind: 'copy',
      from: path.join(ctx.root, 'src/statics/images/reuters-graphics.jpg'),
      to: path.join(ctx.root, previewImg),
    });
  }
  ctx.apply(ops);

  const imageNote =
    placeholderImg ?
      '\n\n' +
      dedent`${c.yellow('Replace the placeholder preview image before publishing:')}
      ${c.cyan(previewImg)} is a copy of the generic reuters-graphics.jpg.`
    : '';

  done(
    ctx,
    path.join(ctx.root, 'pages/embeds', locale, slug),
    dedent`Wire your component into ${c.cyan(`pages/embeds/${locale}/${slug}/+page.svelte`)}.

    Then add this embed to your ${c.cyan('"embeds"')} ArchieML doc with:
      locale: ${c.cyan(locale)}
      slug: ${c.cyan(slug)}
    plus its title, description, notes and altText, and optionally width
    and textWidth (e.g. wide) for the graphic block.` + imageNote
  );
};

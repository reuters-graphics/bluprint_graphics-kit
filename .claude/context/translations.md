# Translations

## Locales structure

Each language has its own directory under `locales/`, containing a `content.json` synced from an RNGS.io story:

```
locales/
  en/
    content.json    # English content (always present)
  es/
    content.json    # Spanish content (added when translating)
```

## Adding a translation

1. Duplicate the English RNGS.io story, connect it to the project, and sync:

```sh
pnpm stories:connect   # connect the translated story, saving to locales/{locale}/content.json. (REQUIRES USER INPUT!)
pnpm stories:sync      # pull translated content locally
```

2. Create a translated dotcom page at `pages/<lang-code>/+page.svelte` by copying `pages/+page.svelte`. In the copy, replace the derived `data.content` setup with a direct import:

```ts
// Replace:
let { data }: { data: PageData } = $props();
let content = $derived(data.content);

// With:
import esStory from '$locales/es/content.json';
let content = esStory.story;
```

3. If the embed should also be translated, copy `pages/embeds/en/page/+page.svelte` to `pages/embeds/<lang-code>/page/+page.svelte` and apply the same content import swap.

A fully translated English + Spanish project looks like:

```
pages/
  +page.svelte                      # English dotcom page
  es/
    +page.svelte                    # Spanish dotcom page
  embeds/
    en/
      page/
        +page.svelte                # English embed
    es/
      page/
        +page.svelte                # Spanish embed
```

## The `locale` prop

Only pass `locale` into `App.svelte` if something inside it actually needs the current language — for example, a language toggle button or locale-specific links. It defaults to `'en'`. If translating only the dotcom page (not the embed), hide any language-switching UI when `embedded === true`.

## RTL languages

For right-to-left languages (Arabic, Hebrew, etc.), set `lang` and `dir` attributes in `src/template.html`:

```html
<html lang="ar" dir="rtl"></html>
```

If `src/template.html` needs to handle both `ltr` and `rtl` languages, then `dir` must be set conditionally based on the page route's `<locale>` code set in the page path.

Override any directional style rules in `src/lib/styles/global.scss`or in component style rules using derivatives like `padding-inline-start` / `padding-inline-end` and `margin-inline-start` / `margin-inline-end` rather than left/right equivalents.

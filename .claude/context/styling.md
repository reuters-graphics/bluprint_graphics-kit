# Styling

## Design system

The graphics design system is a [Tailwind](https://tailwindcss.com/)-like, token-based style system provided by `@reuters-graphics/graphics-components`. Use these tokens in preference to arbitrary CSS values — they encode the team's design decisions and keep pages visually consistent.

For the full token reference (spacing, typography, colour, etc.), read `.claude/llms/graphics-components/` once those docs are available. You can also browse available styles in the [Storybook docs](https://reuters-graphics.github.io/graphics-components/?path=/docs/styles-intro--docs).

## Applying tokens

Tokens can be applied as class names or SCSS mixins (not all tokens support both — check the reference):

```svelte
<!-- Via class -->
<p class="font-bold fmb-3">Lorem ipsum</p>

<!-- Via SCSS mixin -->
<p>Lorem ipsum</p>

<style lang="scss">
  @use '@reuters-graphics/graphics-components/scss/mixins' as mixins;
  p {
    @include mixins.font-bold;
    @include mixins.fmb-3;
  }
</style>
```

**Always include the `@use` line when using SCSS mixins.** Never omit it.

**Never invent token names, class names, or mixin names.** Only use tokens confirmed to exist in the reference. If unsure, point the user to the Storybook docs rather than guessing.

## Fluid spacing

Prefer fluid spacing tokens (prefixed with `f`, e.g. `fmb-3`, `fpy-2`) over fixed spacing tokens for typographic elements — headings, paragraphs, and elements spaced next to text. Fixed spacing tokens (`mb-3`, `py-2`) are fine for non-typographic layout.

## Where to write styles

**Component styles** are preferred — they're scoped automatically by Svelte and travel with the component:

```svelte
<style lang="scss">
  div {
    color: red;
  }
</style>
```

**Global styles** go in `src/lib/styles/global.scss`, already imported across all pages and embeds. Add additional global stylesheets as separate `.scss` files and import them in the specific page that needs them.

Use `:global()` in component styles when targeting elements created by `{@html}` or third-party JS, since Svelte won't scope rules for elements it can't detect statically.

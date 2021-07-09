![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

# Styles

Write styles in svelte components. Read more [about styling in the svelte docs](https://svelte.dev/tutorial/styling).

## SCSS

Add a `lang` attibute to any style tags in your svelte components to use SCSS syntax.

```svelte
<style lang="scss">
  div {
    p {
      color: purple;
    }
  }
</style>
```

If you need to import an SCSS partial that will apply to your entire page -- like one of our house themes -- you can use the `:global` operator.

```svelte
<style lang="scss">
  :global {
    @import '@reuters-graphics/style-theme-eisbaer/scss/main';
    @import '../scss/some-other-global-styles.scss';
  }
</style>
```

You may need to also import font-faces, specifically, if using our house themes:

```svelte
<style lang="scss">
  @import '@reuters-graphics/style-main/scss/fonts/font-faces';
  :global {
    @import '@reuters-graphics/style-theme-eisbaer/scss/main';
  }
</style>
```

## CSS variables

You can use inline [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) to use JavaScript values in your styles:

```svelte
<script>
  let color = '#ff3e00';
</script>

<div style="--theme-color: {color};">
  <p>the color is set using a CSS variable</p>
</div>

<style>
  p {
    color: var(--theme-color);
  }
</style>
```

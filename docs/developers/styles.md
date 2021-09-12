![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

[🏠 Docs](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/docs/developers/README.md) / **Styling pages**

# Styles

There are two ways to write styles in this kit. The first -- _and preferred_ -- way is to write styles _in_ your Svelte components. The second is to create and import a global stylesheet.

- [Component styles](#component-styles)
  - [SCSS](#scss)
  - [Styles from JavaScript](#styles-from-javascript)
- [Global styles](#global-styles)

## Component styles

Generally, it's better to write styles directly in your Svelte components because they will be automatically scoped to just the elements in your component and Svelte will also clean up any unused style rules by default, too. Read more [about styling in the Svelte docs](https://svelte.dev/tutorial/styling). 

### SCSS

Add a `lang` attibute to any style tags in your svelte components to use SCSS syntax.

```svelte
<div>
  <p class='purple'>Lorem ipsum...</p>
</div>

<style lang="scss">
  div {
    p.purple {
      color: purple;
    }
  }
</style>
```



### Styles from JavaScript

If you want to use JavaScript values to style your components, you have a few options.

You can use Svelte's [class directive](https://svelte.dev/tutorial/classes) to set a class conditionally:

```svelte
<script>
  let purple = true;
</script>

<p
  class:purple={purple}
>Lorem ipsum...</p>

<style lang="scss">
p.purple {
  color: purple;
}
</style>
```

...you can write styles inline:

```svelte
<script>
  let colour = 'purple';
</script>

<p
  style="{`color: ${colour};`}"
>Lorem ipsum...</p>
```

...or you can use inline [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) to use JavaScript values in your styles:

```svelte
<script>
  let color = 'purple';
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

## Global styles

If you want to write styles that will apply across several components, you can create an SCSS file anywhere in the `src/` directory...

```SCSS
// src/styles.scss

p.purple {
  color: purple;
}
```

...and then import it and apply it using the `:global` SCSS operator:

```svelte
<!-- pages/index.svelte -->

<style lang="scss">
  :global {
    @import '../src/styles.scss';
  }
</style>
```

**Pro-tip:** You'll likely also want to silence Svelte's internal warnings for unused styles so they don't clutter up your terminal:

```svelte
<!-- svelte-ignore css-unused-selector -->
<style lang="scss">
  :global {
    @import '../src/styles.scss';
  }
</style>
```

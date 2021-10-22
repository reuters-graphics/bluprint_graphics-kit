![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

[🏠 Docs](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/docs/developers/README.md) / **Styling pages**

# Styles

There are two ways to write styles in this kit. The first -- _and preferred_ -- way is to write styles _in_ your Svelte components. The second is to create and import a global stylesheet.

- [Component styles](#component-styles)
  - [SCSS](#scss)
  - [Scoping and the `:global` SCSS operator](#scoping-and-the-global-scss-operator)
  - [Styles from JavaScript](#styles-from-javascript)
- [Global styles](#global-styles)

## Component styles

Generally, it's better to write styles directly in your Svelte components because they will be automatically scoped to just the elements in your component and Svelte will also clean up any unused style rules by default, too. Read more [about styling in the Svelte docs](https://svelte.dev/tutorial/styling).

### SCSS

Add a `lang` attibute to any style tags in your svelte components to use SCSS syntax.

```svelte
<div>
  <p class="purple">Lorem ipsum...</p>
</div>

<style lang="scss">
  div {
    p.purple {
      color: purple;
    }
  }
</style>
```

### Scoping and the `:global` SCSS operator

Styles you write in your components are scoped to just the elements in your component, and Svelte will disregard any rules you write that don't correspond to an element Svelte can detect in your component.

So if your component imports another JS library or uses the [`@html` tag](https://svelte.dev/tutorial/html-tags) to create any elements that you want to style, you should use the SCSS `:global` operator to make sure Svelte doesn't ignore those styles.

Here's an example:

```svelte
<script>
  // Some JS that makes elements
  const sayHello = () => `<p>Hello <span>world</span>!</p>`;
</script>

<div class="my-container">
  {@html sayHello()}
</div>

<style lang="scss">
  div.my-container {
    :global { // 👈
      p {
        color: grey;
        span {
          color: blue;
        }
      }
    }
  }
</style>
```

Notice we can nest the `:global` operator _inside_ a containing element, which will scope our global styles so they don't conflict with any other elements on the page.

If you inspect the elements from this component in your browser, Svelte will create styles for those rules like this:

```css
div.my-container.abc123xyz789 p {
  color: grey;
}
div.my-container.abc123xyz789 p span {
  color: blue;
}
```

### Styles from JavaScript

If you want to use JavaScript values to style your components, you have a few options.

You can use Svelte's [class directive](https://svelte.dev/tutorial/classes) to set a class conditionally:

```svelte
<script>
  let purple = true;
</script>

<p class:purple>Lorem ipsum...</p>

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

<p style="{`color: ${colour};`}">Lorem ipsum...</p>
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
// src/lib/styles/main.scss

p.purple {
  color: purple;
}
```

...and then import it and apply it using the `:global` SCSS operator:

```svelte
<!-- pages/index.svelte -->
<style lang="scss">
  :global {
    @import '../src/lib/styles/main.scss';
  }
</style>
```

**Pro-tip:** You'll likely also want to silence Svelte's internal warnings for unused styles so they don't clutter up your terminal:

```svelte
<!-- svelte-ignore css-unused-selector -->
<style lang="scss">
  :global {
    @import '../src/lib/styles/main.scss';
  }
</style>
```

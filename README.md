![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

# bluprint_graphics-kit

A rig for graphics and newsapps.

Built with:

<a href="https://kit.svelte.dev/" target="_blank">
<img src="https://kit.svelte.dev/images/svelte-kit-horizontal.svg" height="40" />
</a>

## Quickstart

If you haven't already, add this bluprint to your CLI.

```
bluprint add https://github.com/reuters-graphics/bluprint_graphics-kit
```

Make a new directory and use the bluprint.

```
mkdir my-project && cd my-project
bluprint start
```

Check out the README in your created project for details on developing.

## When to use this

This rig is currently best built for projects written in JavaScript. A workflow for incorporating Adobe Illustrator-created graphics is [in the works](https://github.com/reuters-graphics/bluprint_graphics-kit/issues/7), but for now, choose this rig for graphics you plan to build in JS.

The rig improves on our current [graphics rig](https://github.com/reuters-graphics/bluprint_graphics-rig/) by letting you build _multiple_ pages and embeds. It's well-suited for multipage graphics or projects with graphics components that make sense as individual embeds for media clients. It's also perfect for building simple projects with Svelte.

## Prereqs

### Node

This rig requires a node version >= 14.16.0. I highly recommend using a node version manager so you can easily switch which version of node you want to use.

[n](https://github.com/tj/n) is a great option and can be installed easily on a mac using brew:

```
brew install n
```

Once installed, you can use it to download and install any version of node:

```
n 14.16.0
```

### Svelte

This rig uses [Svelte](https://svelte.dev/). Check out the [official tutorial](https://svelte.dev/tutorial/basics) for an intro to the framework.

### ES modules

This rig uses [SvelteKit](https://kit.svelte.dev/) (currently in beta), which in turn uses a build tool called [Vite](https://vitejs.dev/guide/why.html). Both can be tempermental with libraries that weren't built for a world with [ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).

Where you can, use modern libraries that package code as ESM (most use a ["module" key in package.json](https://github.com/rollup/rollup/wiki/pkg.module)). If you're still running into issues with a dependency, check out the [SvelteKit FAQ](https://kit.svelte.dev/faq#how-do-i-fix-the-error-i-m-getting-trying-to-include-a-package) and, if you really need to dig in, the docs on Vite's [dependency pre-bundling feature](https://vitejs.dev/guide/dep-pre-bundling.html) to deal with non-ESM code.

You'll also want to _write_ your code using ES module syntax: `import`/`export` instead of `require`/`module.exports`. Here's an [intro](https://medium.com/backticks-tildes/introduction-to-es6-modules-49956f580da).

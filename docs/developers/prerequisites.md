![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

# Prerequisites

- [Code editor](#code-editor)
- [Node](#node)
- [Svelte](#svelte)
- [Components](#components)
- [ES modules](#es-modules)

## Code editor

We recommend using [VS Code](https://code.visualstudio.com/), which will allow you to take advantage of [useful snippets](https://code.visualstudio.com/docs/editor/userdefinedsnippets) and built-in linting/prettifying that will help identify and fix errors in your code.

## Node

This rig requires a node version >= 14.16.0. We highly recommend using a node version manager so you can easily switch which version of node you want to use.

[n](https://github.com/tj/n) is a great option and can be installed easily on a mac using brew:

```
brew install n
```

Once installed, you can use it to download and install any version of node:

```
n 14.16.0
```

## Svelte

This rig uses [Svelte](https://svelte.dev/), and you'll likely want to understand a few basics before diving in. Check out the [official tutorial](https://svelte.dev/tutorial/basics) for an intro to the framework.

## Components

You may want to have a look at some of the pre-built [graphics Svelte components](https://reuters-graphics.github.io/graphics-svelte-components/) we use out-of-the-box.

## ES modules

This rig uses [SvelteKit](https://kit.svelte.dev/) (currently in beta), which in turn uses a build tool called [Vite](https://vitejs.dev/guide/why.html). Both can be tempermental with libraries that weren't built for a world with [ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).

Where you can, use modern libraries that package code as ESM (most use a ["module" key in package.json](https://github.com/rollup/rollup/wiki/pkg.module)). If you're still running into issues with a dependency, check out the [SvelteKit FAQ](https://kit.svelte.dev/faq#how-do-i-fix-the-error-i-m-getting-trying-to-include-a-package) and, if you really need to dig in, the docs on Vite's [dependency pre-bundling feature](https://vitejs.dev/guide/dep-pre-bundling.html) to deal with non-ESM code.

You'll also want to _write_ your code using ES module syntax: `import`/`export` instead of `require`/`module.exports`. Here's an [intro](https://medium.com/backticks-tildes/introduction-to-es6-modules-49956f580da).

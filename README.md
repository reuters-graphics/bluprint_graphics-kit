![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

# bluprint_graphics-kit

A rig for graphics and newsapps.

Built with:

<a href="https://kit.svelte.dev/" target="_blank">
<img src="https://kit.svelte.dev/images/svelte-kit-horizontal.svg" height="40" />
</a>

## Quickstart

This rig is best used with [bluprint](https://github.com/reuters-graphics/bluprint), our in-house templating tool.

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

## Docs

Read more in the [developer docs](docs/developers/README.md).

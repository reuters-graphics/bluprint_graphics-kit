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
bluprint add reuters-graphics/bluprint_graphics-kit
```

Make a new directory and use the bluprint.

```
mkdir my-project && cd my-project
bluprint start
```

Check out the README in your created project for details on developing.

## When to use this

> <img src="https://www.searchpng.com/wp-content/uploads/2019/02/Traffic-Cone-Clipart-PNG-Image.png" width="80"/>
>
> **WARNING:** This rig is still in active development and is also largely based on other people's software, which is still in beta. You are free to use it for projects but assume you will likely need support from me (Jon) before you publish, so build in a little time for troubleshooting, especially close to deadline.

The rig improves on our current [graphics rig](https://github.com/reuters-graphics/bluprint_graphics-rig/) by letting you build _multiple_ pages and embeds. It's well-suited for multipage graphics or projects with graphics components that make sense as individual embeds for media clients. It's also perfect for building simple projects with Svelte.

Some projects built with this rig:

- [Biden approval tracker](https://graphics.reuters.com/USA-BIDEN/POLL/nmopagnqapa/) (single dotcom page, multiple embeds for clients)
- [Euros 2020](https://graphics.reuters.com/SOCCER-EURO/yzdvxmjjnpx/) (multiple dotcom pages)
- [Hot and humid Olympic Summer](https://graphics.reuters.com/OLYMPICS-2020/SUMMER-HEAT/bdwvkogrzvm/index.html) (standard graphic page)

## 📚 Developer Docs

Read more in the [developer docs](docs/developers/README.md) about how to use this rig to create graphics pages.

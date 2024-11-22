---
'@reuters-graphics/graphics-kit': major
---

The 1.0 🎉 release of the Reuters Graphics Kit.

## New features

### RNGS.io becomes the default CMS

New projects will, by default, create a new storyboard in [RNGS.io](https://rngs.io) and connect a new story to the project.

You can, however, opt out of this option on project startup.

If using Google Docs, you'll need to create a new doc yourself (by copying from [this template](https://docs.google.com/document/d/1RRlXYeZ1rRfY1OJbb9m3Ada4fQ8bc1FegaQBVJGA1k0/edit?tab=t.0) in Drive) and add it to your project's `google.json`.

Read more on configure Google Docs [here](https://reuters-graphics.github.io/graphics-bin/classes/GoogleClient.html#md:config-file).

### `pnpm` replaces `yarn`

With this release, we're switching to [`pnpm`](https://pnpm.io/) and away from `yarn` for package management. There are a number of technical reasons why, but the main ones are because it's faster, takes up less memory, is better maintained and, generally, is an easy drop in replacement.

In most cases, which package manager you use doesn't matter, but in a few it does, and with this change, we're covering more of those edge cases that occasionally come up.

Obviously, the muscle memory around using `yarn` will take a bit to work out.

For any of our basic commands, you can just replace `yarn` with `pnpm`:

- `pnpm start`
- `pnpm preview`
- `pnpn upload`
- `pnpm pub`

When _installing_ new packages, you'll use `pnpm install` (or `i` for short) instead of `yarn add`:

```console
pnpm i d3
```

> **🚨 IMPORTANT:** Before you start your next project, you should install `pnpm` globally. Just run:
>
> ```console
> npm install -g pnpm
> ```

### Preview pages will be deleted

... automatically when you publish your project via the terminal (`pnpm pub`). This is a safeguard after a few of our preview pages were accidentally leaked to the wider web.

If you need to look at a preview page again after publishing, you just need to run `pnpm preview` to regenerate it.

## Updates from dependencies

### `@reuters-graphics/graphics-components`: Updated docs site

With this update, we've gone through and touched up the [components docs site](https://reuters-graphics.github.io/graphics-components/?path=/docs/intro--docs). There are some minor changes on individual components, which have been documented. You will also notice "Quickit" stories have been transformed into "ArchieML" stories, for wider compatibility with RNGS.io.

We've also generally scrubbed the docs for examples that had fallen behind component updates, but [let us know](https://github.com/reuters-graphics/graphics-components/issues/new?labels=documentation&assignees=hobbes7878) if we missed any.

Finally, we've given the ["Guides"](https://reuters-graphics.github.io/graphics-components/?path=/docs/guides-using-these-docs--docs) section a write-through. In particular, we've beefed up a new page on [working with ArchieML docs](https://reuters-graphics.github.io/graphics-components/?path=/docs/guides-using-with-archieml-docs--docs). The goal is to get everyone more comfortable with the ArchieML > JSON > Svelte component flow. Check it out.

### `@reuters-graphics/graphics-bin`: Keys for publishing preview pages

Starting next year, we're going to be rotating the keys that allow us to publish preview pages to our S3 bucket, i.e., the "testfiles" directory.

To make it easier to maintain access without needing everyone to update a local file on your computer each time those keys change, we're going to leverage the API in our Reuters Graphics 1Password account.

The first time you run `pnpm preview` in the updated kit, you'll be prompted to grab a 1Password API token from ... 1Password. This will be a one-time thing unless we decide to rotate that token after staff turnover, in which case you'll just be prompted again.

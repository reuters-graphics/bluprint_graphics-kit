# @reuters-graphics/graphics-kit

## 2.2.9

### Patch Changes

- ffaf5c0: Updates @reuters-graphics dependencies to latest versions.

## 2.2.8

### Patch Changes

- cc0fd46: Fixing handling for pages where one of the Reuters slugs contains a space character.

## 2.2.7

### Patch Changes

- 8dc305e: Updates @reuters-graphics dependencies to latest versions.
- e6a2c46: Updates @reuters-graphics dependencies to latest versions.

## 2.2.6

### Patch Changes

- bf502bd: Updates @reuters-graphics dependencies to latest versions.

## 2.2.5

### Patch Changes

- 559272a: Updates @reuters-graphics dependencies to latest versions.

## 2.2.4

### Patch Changes

- 6bc5dd5: Updates rngs-io-client.

## 2.2.3

### Patch Changes

- 15918b4: Adds a last publish time check to live endpoints so the app uses the latest version of the story, either locally synced or published via the live endpoint.

## 2.2.2

### Patch Changes

- dd6af1a: Updates @reuters-graphics dependencies to latest versions.

## 2.2.1

### Patch Changes

- 9e533a9: - Bumps graphics-kit-publisher for new LSEG embed manifests and SRI integrity attributes on all embed pages.
  - Bumps graphics-components, which fixes Google Analytics for GDPR compliance.

## 2.2.0

### Minor Changes

- 44236fd: Updates the embeds page template for better compatibility with Arc CMS

### Patch Changes

- 23e774e: Updates graphics-components for new GDPR analytics scripts

## 2.1.3

### Patch Changes

- 7976b68: Updates svelte, svelte-check, prettifier-plugin-svelte dependencies

## 2.1.2

### Patch Changes

- e5d44cd: Adds an automatic git commit when publishing a preview of a project, per #238.

## 2.1.1

### Patch Changes

- 3b3ac3c: Adds additional context for VS Code Copilot, including llms.txt and repository custom instructions.

  [llms.txt](https://llmstxt.org/) is a new standard for providing context to Large Language Models like those used by Microsoft Copilot. It's particularly useful for tailoring prompt responses to particular conventions you want the model to consider or adhere to.

  This update adds the [small context window llms.txt for Svelte and SvelteKit](https://svelte.dev/docs/llms), helping LLMs respond, for example, with Svelte 5 syntax which may not yet be part of the model's training data.

  This update also adds an llms.txt describing our components library, [@reuters-graphics/graphics-components](https://reuters-graphics.github.io/graphics-components/). It outlines the usual conventions we follow when adding graphics components to our pages, including how we write the content fed to a component's props in RNGS.io.

  [Repository custom instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot) are a new feature in VS Code we can use to tell Copilot to refer to our llms.txt files.

  What's that all mean for _you_? ...

  ### ✨ Try it out!

  Open up a new [Copilot chat](https://code.visualstudio.com/docs/copilot/chat/copilot-chat) and try a specific prompt like:

  > How can I add an AI graphic component called myMap.svelte to my page?

  You should get a response that demonstrates the AI model now knows a bit about our graphics components, about common conventions we use in the graphics kit, about our design system, even a bit about our CMS, RNGS.io.

  ### 📢 Open call for contributions

  Adding hints to Large Language Models is very much more art than a science. You can help us make Copilot smarter by reporting back things it _does_ or _doesn't_ do well as you're building your project.

  Make a [new issue](https://github.com/reuters-graphics/bluprint_graphics-kit/issues) on the graphics kit repo telling us what those tasks are, and we'll work on adding examples of how to do them right to our llms.txt files.

## 2.1.0

### Minor Changes

- deecfb9: Updates graphics-components to 3.0, vite-plugin-purge-styles to 0.0.3

  ## New features

  ### Updated graphics components

  Updates the graphics components to `3.0`.

  While all components in the `graphics-components` library are now written in Svelte 5, the graphics kit is compatible with both Svelte 4 and 5, so you can continue writing components in Svelte 4 syntax for now.

  Read more in the graphics comopnents's [new documentation site](https://reuters-graphics.github.io/graphics-components/?path=/docs/intro--docs).

## 2.0.2

### Patch Changes

- 7bc1dc0: Adds Savile for resizing, optimising or reformating images.

## 2.0.1

### Patch Changes

- a0e6828: Fixes a bug on embeds where metadata was being lost on dotcom, closing #196.

## 2.0.0

### Major Changes

- 11f2398: 🎉 Version 2.0 of the Reuters graphics kit.

  ## New features

  ### Updated publisher

  Updates the graphics kit publisher. Read more in the publisher's [3.0 announcement](https://reuters-graphics.github.io/graphics-kit-publisher/notes/announcing-3-0/).

  ### Embeds-only projects

  The graphics kit now handles embeds-only projects. In-person demos to show the new functionality will be coming to a desk near you soon.

  ### New docs

  Read more in the graphics kit's [new documentation site](https://reuters-graphics.github.io/bluprint_graphics-kit/).

## 1.1.2

### Patch Changes

- 3dc489c: Adds prettier-plugin-svelte to devDependencies which fixes:
  https://github.com/reuters-graphics/bluprint_graphics-kit/issues/160

## 1.1.1

### Patch Changes

- 5b02efc: Bump's @reuters-graphics/graphics-bin for the fix to https://github.com/reuters-graphics/graphics-bin/issues/57.

## 1.1.0

### Minor Changes

- a62708c: 🤖 Svelte 5 alive! Svelte 5 is now enabled inside the Graphics Kit.

  ## Migration steps

  The minimum version of Node is now `>20.18`.

  Check out Svelte's [official migration guide](https://svelte.dev/docs/svelte/v5-migration-guide) to read up on Svelte 5's overhauled syntax and new reactivity system with [Runes](https://svelte.dev/docs/svelte/what-are-runes).

  Not ready to make the leap? Don't worry! You can continue to write components in Svelte 4 / "Legacy" syntax with no problems. You'll just get faster pages with no change to your code. You can even mix and match components using the new syntax with components using the old and vice versa.

## 1.0.7

### Patch Changes

- f5281e5: Fixes build scripts for pnpm > 10

## 1.0.6

### Patch Changes

- 355aa61: Improves S3 upload speed and cache strategy.

  Projects already created can get the same boost by updating `@reuters-graphics/graphics-bin` in package.json's `devDependencies` to at least `^1.1.2`.

## 1.0.5

### Patch Changes

- 531affc: Bumps graphics-bin and graphics-kit-publisher for our new IHN-approved AWS S3 preview bucket.

  Following the planned change to our CloudFront distribution on Dec. 17, projects without this change will not be able to publish preview pages.

  ## Migration steps

  **If your project was created _before_ the release of the [1.0.0 version](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/main/CHANGELOG.md#100) of the Graphics Kit,** (check the version number in your project's `package.json`) you must create a _new_ project and migrate your app to that.

  When creating a new project, you _should_ create a new repo, but you may skip creating a RNGS.io doc if you have an existing one or are using Google Docs for content.

  Copy any components or stylesheets you made or changed from the `src/lib/` directory into the new project, as well as any static files (images, etc.) in `src/statics/` and AI files in `project-files/`.

  If you didn't create a new RNGS.io doc above, copy the configuration file `rngs-io.json` or `google.json` to your new project.

  You _may_ need to also update some components in the `pages/` directory if you changed any code there.

  **If your project was created _after_ the 1.0.0 version,** then you can bump the version numbers of the dependencies `@reuters-graphics/graphics-bin` and `@reuters-graphics/graphics-kit-publisher` to the latest version in `package.json` and reinstall with `pnpm i`.

## 1.0.4

### Patch Changes

- cdec626: Bumps rngs-io-client to gracefully handle _not_ creating a RNGS.io story on project startup. See #134.

## 1.0.3

### Patch Changes

- 23c0f4e: Adds LogBlock component for printing warnings and info messages on a page in development.

  ```svelte
  <script>
    import LogBlock from '$lib/components/dev/LogBlock.svelte';
  </script>

  <LogBlock message="A red warning message to the user" />

  <LogBlock level="info" message="A softer info message" />
  ```

  ... and adds info LogBlocks for ad spots in development.

## 1.0.2

### Patch Changes

- 672c5fa: Adds live endpoints handler class. Updates minimum Node version to 20.

## 1.0.1

### Patch Changes

- a1f847a: Updates sass API to use the modern compiler.

## 1.0.0

### Major Changes

- 474403f: The 1.0 🎉 release of the Reuters Graphics Kit.

  ## Migration steps

  Upgrade to Node version 20 or 22 and install [pnpm](https://pnpm.io/) globally:

  ```console
  npm install -g pnpm
  ```

  All other updates will be included on new projects when started.

  You should not update existing projects or their dependencies as part of this release.

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

# Graphics kit

This repo contains the basic SvelteKit project template for a graphics project. Graphics projects are always published as static sites on reuters.com and as embeddable HTML pages for Reuters media clients, which they can download from a separate service online (Reuters Connect). Users may also include static media files for clients in this project.

## Tech stack

- **SvelteKit** with **Svelte 5** — always use Svelte 5 runes syntax (`$state`, `$derived`, `$effect`, etc.)
- **TypeScript** preferred throughout
- **SCSS** for styles
- **pnpm** as package manager
- **`@reuters-graphics/graphics-components`** — the team's component library; the primary source of UI components added to graphics projects as well as SCSS stylesheets and design system tokens
- **`@reuters-graphics/graphics-kit-publisher`** — team CLI for publishing graphics projects to the Sphinx Reuters Graphics Server, the deployment platform used to publish pages both on reuters.com and to media clients via Reuters Connect

## Project structure

The default project structure before any customisations is:

```
locales/en/content.json   # Primary content file, synced from the CMS (usually, rngs.io)
src/lib/App.svelte         # Main component — wires CMS content into graphics components for the page
src/lib/                   # Reusable components and utilities for this project
pages/                     # SvelteKit routes (home page, embeds, embed previewer)
src/statics/               # Static assets (images, videos, etc.)
media-assets/              # Static media files (JPG, PDF and EPS files) provided to clients
```

For detail on how CMS content is structured and how to wire it into graphics components in `App.svelte`, read [`.claude/context/content.md`](.claude/context/content.md).

Most graphics projects publish a single page for reuters.com, an embeddable version of the same page for media clients and embed previewer page for previewing the embeddable in an iframe in development.

Other projects may have additional pages for reuters.com (any additional page in the `pages/` directory) or addition embeds of individual graphics (pages in the `pages/embeds/` directory).

## External services

- **rngs.io** is the Reuters Graphics CMS for writing page text and other structured data we want to edit in collaboration with others in our newsroom. We export that content to JSON files in the `locales/` directory. Those JSON files are synced and connections between the project and editable documents in rngs.io using the `rngs-io` CLI (see `stories:` prefixed scripts in `package.json`), provided by the `@reuters-graphics/rngs-io-client` library. Configuration for rngs.io connections is in `rngs-io.json`.
- **Google Sheets and Docs** are used sometimes in place of or in addition to rngs.io docs to write editable content. Also synced to JSON files in the `locales/` directory using the `graphics` CLI, e.g., `get-google` script in `package.json`. Connections are configured in `google.json`.
- **Sphinx Graphics Server** is the distribution platform for Reuters Graphics projects. Projects are uploaded then published to the Sphinx Server using the `graphics-publisher` CLI, provided by the `@reuters-graphics/graphics-kit-publisher` library.
- **graphics.thomsonreuters.com** is an S3 bucket we use for publishing preview versions of graphics projects. Pages published there for preview purposes are never shared publically and are automatically deleted after a project is published.

## Key commands

```sh
pnpm start          # dev server for the graphics kit
pnpm preview        # upload project to graphics.thomsonreuters.com S3 server for previewing
pnpm upload         # upload project files to the Sphinx Graphics Server
pnpm pub            # publish the graphics pack already uploaded to the Sphinx Graphics Server
pnpm build          # production build, called during upload command
pnpm build:preview  # preview build, called during preview command
pnpm mods           # Shortcut CLIs that modify files to add features or change project configuration
pnpm stories:sync   # Runs CLI that syncs local JSON files in locales/ with rngs.io
pnpm get-google     # Runs CLI that syncs local JSON files in locales/ with Google Docs and Sheets
pnpm lint           # lint
pnpm format         # format
```

## Key dependencies

<!-- llms-deps:start -->

| Dependency | Context doc                                                          | When to use                                                                                 |
| ---------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| ArchieML   | [`.claude/llms/archieml/docs.md`](.claude/llms/archieml/docs.md)     | Writing ArchieML syntax in rngs.io to match content block types used in graphics components |
| Svelte 5   | [`.claude/llms/svelte/docs.md`](.claude/llms/svelte/docs.md)         | Writing or modifying any Svelte component — covers runes, snippets, and Svelte 5 syntax     |
| SvelteKit  | [`.claude/llms/svelte-kit/docs.md`](.claude/llms/svelte-kit/docs.md) | Working with routing, layouts, load functions, hooks, or SvelteKit config                   |

<!-- llms-deps:end -->

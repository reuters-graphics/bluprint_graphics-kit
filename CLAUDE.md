# Graphics kit bluprint

This repo contains the basic SvelteKit project template for graphics projects. New projects are started from this template using the team's inhouse CLI [`bluprint`](https://github.com/reuters-graphics/bluprint), which downloads the repo's tarball, scaffolds the project files from that, initialises a new repository and then customises some of the files and runs setup scripts for each project (configured in `.bluprintrc`).

This repo also contains a **docs site**, an Astro Starlight site in `/docs/` with user-facing documentation for working with the kit. When a new project is scaffolded from this template, the `/docs/` directory is stripped from the new repo.

Always keep template work and docs work clearly separate.

## Tech stack

- **SvelteKit** with **Svelte 5** — always use Svelte 5 runes syntax (`$state`, `$derived`, `$effect`, etc.)
- **TypeScript** preferred throughout
- **SCSS** for styles
- **pnpm** as package manager
- **`@reuters-graphics/graphics-components`** — the team's component library; the primary source of UI components added to graphics projects

## Key commands

```sh
pnpm start          # dev server for the graphics kit
pnpm test           # run tests
pnpm lint           # lint
pnpm format         # format
pnpm mods           # Shortcut CLIs that modify files to add features or change project configuration
```

For the docs site, run the same commands from `/docs/`:

```sh
cd docs && pnpm start   # dev server for the docs site
cd docs && pnpm build   # production build of the docs site
```

## Changesets

This repo uses [changesets](https://github.com/changesets/changesets) for versioning. Any PR that changes the template or its dependencies should include a changeset entry. Run `pnpm changeset` to create one — it will prompt for a summary and whether the change is a patch, minor, or major bump. Changeset files live in `.changeset/` and are consumed by the release workflow to cut new versions.

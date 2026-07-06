# Graphics kit bluprint

This repo contains the basic SvelteKit project template for graphics projects. New projects are started from this template using the team's inhouse CLI [`bluprint`](https://github.com/reuters-graphics/bluprint), which downloads the repo's tarball, scaffolds the project files from that, initialises a new repository and then customises some of the files and runs setup scripts for each project (configured in `bluprint.config.ts`).

This repo also contains a **docs site**, an Astro Starlight site in `/docs/` with user-facing documentation for working with the kit. When a new project is scaffolded from this template, the `/docs/` directory is stripped from the new repo.

Always keep template work and docs work clearly separate.

## The `gfx` branch workaround (scaffolded projects only)

`bluprint.config.ts` sets up a `gfx` working branch for each scaffolded project, and `.claude/context/git-workflow.md` documents it. **That workflow governs scaffolded graphics projects only — it does NOT apply to this template repo.** This repo uses normal GitHub Flow on `main` via PRs (see `CONTRIBUTING.md`); ignore `.claude/context/git-workflow.md` when working here (it exists in this repo only so it ships into scaffolded projects).

It's a **temporary** measure while we negotiate to remove the org's default-branch restriction on our repos. To remove it once that lands, delete the `gfx workflow` block of `execute` actions in `bluprint.config.ts` and the `.claude/context/git-workflow.md` doc (and the Git workflow section in `PROJECT_CLAUDE.md`).

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

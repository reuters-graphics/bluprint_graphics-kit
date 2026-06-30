# Glossary

Reuters Graphics- and kit-specific terms. Does not cover generic web or Svelte terminology.

---

**ai2svelte** — Reuters Graphics' Illustrator export script (a Svelte port of the NYT's [ai2html](http://ai2html.org)). Exports an Adobe Illustrator file as a responsive Svelte component into `src/lib/ai2svelte/`, with accompanying images in `src/statics/images/graphics/`. See also: _AI graphic_.

**AI graphic** — A graphic created in Adobe Illustrator and exported with ai2svelte. "AI" here always means **Adobe Illustrator**, never artificial intelligence.

**bluprint** — The team's in-house CLI for scaffolding new projects from template repositories. Run once at project creation; not used again afterward.

**content block** — An object in the `blocks` array of `locales/en/content.json`. Each block has a `type` field that determines which Svelte component renders it. See `.claude/context/content.md`.

**dotcom** — The reuters.com website. A "dotcom page" is the version of the graphic published at a reuters.com URL. Contrast with _embeds_, which are for media clients.

**embed / embeddable graphic** — An HTML page in `pages/embeds/<lang>/<slug>/` designed to be iframed into a client's website or other dotcom stories. Uses `PymChild` for responsive resizing. All embeds carry a `noindex, nofollow` robots tag.

**embed previewer** — A dev-only page at `/embed-previewer` that wraps an embed in an iframe so developers can preview how it will appear when embedded by clients.

**graphics server / Sphinx** — The Reuters Graphics distribution platform. Projects are uploaded (`pnpm upload`) then published (`pnpm pub`) here. Do not publish without editorial authorisation.

**graphics.thomsonreuters.com** — An S3 bucket used for shareable preview links (`pnpm preview`). Previews are never public and are automatically deleted after the project is published to Sphinx.

**kit mod / mod** — An interactive CLI tool invoked via `pnpm mods`. Mods make structured changes to the project (e.g., switching project type, creating embed pages for AI graphics, exporting static media). They require user input and cannot be run autonomously. Prefer mods over manual file edits for the tasks they cover.

**media clients** — External news organisations that license Reuters graphics via _Reuters Connect_. They receive embeddable HTML pages and/or static JPG/EPS files packaged by the publisher.

**media assets** — JPG and EPS files in `media-assets/<lang>/<slug>/` packaged for media clients alongside embeddable pages. When the language/slug matches a `pages/embeds/` page, the publisher bundles them into a single archive on the graphics server.

**pages+** — The default project type: publishes both a dotcom page and embeddable graphics. Other types are _embeds-only_ (no indexable dotcom page) and _pages-only_ (no embeds). Switch project type using `pnpm mods`, not by manually restructuring files.

**PymChild** — A component from `@reuters-graphics/graphics-components` that enables responsive iframe resizing for embedded graphics. Must be included in every embed page.

**Reuters Connect** — The Reuters service through which media clients discover and download graphics packs (embeds and static assets) from the graphics server.

**RNGS.io** — The Reuters Graphics CMS. Journalists and editors write page text and structured data here in ArchieML syntax. Content is synced to `locales/en/content.json` via `pnpm stories:sync`.

**Savile** — An interactive image optimisation tool built into the kit (`pnpm savile`). Requires user input; do not run autonomously. Prompt the user to run it if you detect large image files in `src/statics/`.

**Sphinx** — See _graphics server_.

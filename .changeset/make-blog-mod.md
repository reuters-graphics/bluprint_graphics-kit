---
'@reuters-graphics/graphics-kit': minor
---

Add a `make-blog` mod that converts a scaffolded project into a graphics blog: a main page that
renders each post in reverse-chronological order plus a per-post permalink route for crawlers. It runs
in two phases — deterministic, transactional local scaffolding (blog `pages/`, a `Post.svelte`
component, removing the single-page app/embed), then best-effort RNGS.io wiring (empties the existing
stories, creates "Main page" and "Post 1" stories from templates, and syncs their content). Conversion
is one-way, marked by `bin/mods/.converted-to-blog`, after which the `project-type` mod refuses to run.

Also adds a shared `src/utils/slugify` helper to the base scaffold.

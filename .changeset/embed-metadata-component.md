---
'@reuters-graphics/graphics-kit': minor
---

Adopt the new `EmbedMetadata` component on embed pages, replacing `SEO`. Bumps `@reuters-graphics/graphics-components` to 4.5.2, which introduces `EmbedMetadata` — a component that renders only the metadata an embed needs (a canonical link, `og:image` and a `noindex, nofollow, noarchive` robots tag) and mounts `PymChild` itself. Updates the existing embed page (`pages/embeds/en/page/`), the `make-ai-embed` and `project-type` (pages-plus) mod templates, and the docs to use `EmbedMetadata` in place of `SEO` on embed pages, dropping the now-unnecessary `SEO`/`PymChild` imports, the manual `robots` meta tag and the SEO-only props.

---
'@reuters-graphics/graphics-kit': patch
---

Replace the deprecated `assets`/`base` exports from `$app/paths` with the new `asset(...)`/`resolve(...)` functions across template pages, mods, editor snippets, and context docs, matching SvelteKit 2.26+.

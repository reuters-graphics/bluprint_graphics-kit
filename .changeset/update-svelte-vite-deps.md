---
'@reuters-graphics/graphics-kit': patch
---

Bumps svelte, @sveltejs/kit, vite, vitest, @sveltejs/adapter-static, svelte-check, svelte-preprocess, prettier-plugin-svelte, and @reuters-graphics/graphics-components to their latest versions, and finishes migrating the remaining `assets`/`base` usages (SEO canonical URLs, embed-previewer's back link, template pages, mods, editor snippets, and context docs) to `asset(...)`/`resolve(...)`, matching SvelteKit 2.26+. `@reuters-graphics/graphics-components`'s only breaking change (a `base` string prop replaced with a `resolve` function prop on `LanguageButton`, `BlogTOC`, and `BlogPost`) doesn't affect this template, which doesn't use those components.

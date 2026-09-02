---
'@reuters-graphics/graphics-kit': patch
---

Exclude `maplibre-gl` from Vite's dependency pre-bundler so the dev server starts. `graphics-components`' TileMap worker imports MapLibre's worker through Vite's `?worker&url` recipe, and `svelte-package` copies that specifier into `dist` verbatim. Vite 8's Rolldown-based optimizer reads the query string as part of the filename and fails with `[UNLOADABLE_DEPENDENCY]` before the dev server ever comes up — so `pnpm start` was broken on a fresh kit for every project, whether or not it used a map, because the optimizer scans the component library's entry and that entry re-exports TileMap. Excluding `maplibre-gl` leaves the specifier for Vite's own transform pipeline, which understands the query and emits the worker correctly. Excluding only MapLibre rather than the whole component library keeps `graphics-components` pre-bundled, so dev server cold starts don't regress.

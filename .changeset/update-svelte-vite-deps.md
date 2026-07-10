---
'@reuters-graphics/graphics-kit': minor
---

Updates the kit's Svelte, SvelteKit, Vite, and component library dependencies to their latest majors.

Pass SEO's `baseUrl` a dedicated `__BASE_URL__` build-time constant instead of `asset('/')`, which is meant for asset URLs, not page URLs.
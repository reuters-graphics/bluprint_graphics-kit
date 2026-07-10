---
'@reuters-graphics/graphics-kit': patch
---

Expose a fully specified `__BASE_URL__` global (injected at build time via Vite `define` from `getBasePath(mode, { trailingSlash: true, rootRelative: false })`) and pass it to the `SEO` component's `baseUrl` prop, so prerendered canonical/OG URLs use the correct site origin instead of the CDN asset path.

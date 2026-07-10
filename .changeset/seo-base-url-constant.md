---
'@reuters-graphics/graphics-kit': patch
---

Pass SEO's `baseUrl` a dedicated `__BASE_URL__` build-time constant instead of `asset('/')`, which is meant for asset URLs, not page URLs.

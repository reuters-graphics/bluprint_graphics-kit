---
'@reuters-graphics/graphics-kit': patch
---

Fix the Docs GitHub Actions workflow, which was failing on every run since the `savile` 0.2.0 update. The repo had drifted to three different resolved `sharp` versions; the root-level pin (`^0.33.5`) was older than what `astro` itself now requires (`^0.34.0`), and that stale copy was falling back to a broken legacy native-binary build. Bumping the root `sharp` dependency to `^0.34.5` collapses the duplicate installs and lets Astro's image optimization use a working prebuilt binary.

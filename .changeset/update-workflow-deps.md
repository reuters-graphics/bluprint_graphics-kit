---
'@reuters-graphics/graphics-kit': patch
---

Update GitHub Actions workflow dependencies and bump the minimum Node version to 22 (testing on 22 and 24).

- `actions/checkout` v4 → v7
- `pnpm/action-setup` v4 → v6
- `actions/setup-node` v4 → v6
- `peter-evans/create-pull-request` v7 → v8
- `actions/configure-pages` v4 → v6
- `actions/upload-pages-artifact` v3 → v5
- `actions/deploy-pages` v4 → v5
- CI test matrix now runs on Node 22 and 24; `engines.node` bumped to `>=22`.

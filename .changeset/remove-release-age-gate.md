---
'@reuters-graphics/graphics-kit': patch
---

Disable pnpm's `minimumReleaseAge` gate (`minimumReleaseAge: 0`) in `pnpm-workspace.yaml`. Projects are scaffolded from this template's committed lockfile via `pnpm install`, so under pnpm 11 (which enforces a 24h default) any lockfile entry published within that window would block a fresh scaffold entirely until the package aged out. Turning the gate off keeps scaffolding reliable regardless of when third-party dependency versions land. Also removes the now-redundant `minimumReleaseAgeExclude` for `@reuters-graphics/*`.

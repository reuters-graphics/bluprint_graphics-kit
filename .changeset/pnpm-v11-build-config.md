---
'@reuters-graphics/graphics-kit': minor
---

Move the build-script allowlist for dependencies with postinstall steps (sharp, esbuild, lefthook, etc.) from the `pnpm` field in `package.json` into a new `pnpm-workspace.yaml`. pnpm 11 no longer reads the `package.json#pnpm` field and renamed `onlyBuiltDependencies` to `allowBuilds`, so the file lists both keys — `onlyBuiltDependencies` (read by pnpm 10) and `allowBuilds` (read by pnpm 11) — to work on both. Requires pnpm >= 10; CI workflows now install pnpm 10.

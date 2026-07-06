---
'@reuters-graphics/graphics-kit': minor
---

Scaffolding now sets up a `gfx` working branch for new graphics projects. `main` is pushed as the protected default branch, then a `gfx` branch is created, pushed, and checked out — a temporary workaround for org default-branch protection that blocks our shared-branch deadline workflow. A new `.claude/context/git-workflow.md` doc ships with scaffolded projects explaining the `gfx` workflow and how to migrate back once the restriction is lifted.

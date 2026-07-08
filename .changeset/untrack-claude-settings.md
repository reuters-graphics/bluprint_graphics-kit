---
'@reuters-graphics/graphics-kit': patch
---

Stop tracking `.claude/settings.json` and ignore both it and
`.claude/settings.local.json` in the project `.gitignore`. These hold personal,
machine-specific Claude Code settings (e.g. accumulated permission grants) that
shouldn't be committed or shipped into scaffolded projects. Shared Claude
resources under `.claude/` (context, llms, skills) remain tracked.

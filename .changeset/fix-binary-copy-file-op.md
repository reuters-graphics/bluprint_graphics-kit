---
'@reuters-graphics/graphics-kit': patch
---

Fix the `copy` file op corrupting binary files, which left the JPG that `export-ai-statics` mirrors into `src/statics` unreadable and made `pnpm upload` fail with a confusing `unsupported file type: undefined`. `copy` decoded every source as UTF-8 so it could run find/replace, mangling any byte that wasn't valid UTF-8. It now only decodes when replacements are actually supplied and otherwise copies bytes verbatim, and it throws a clear error rather than silently corrupting output if replacements are ever requested for a non-UTF-8 file.

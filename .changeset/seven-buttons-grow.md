---
'@reuters-graphics/graphics-kit': patch
---

Bumps graphics-bin and graphics-kit-publisher for our new IHN-approved AWS S3 preview bucket.

## Migration steps

**If your project was created _before_ the release of the [1.0.0 version](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/main/CHANGELOG.md#100) of the Graphics Kit,** you must create a _new_ project and migrate your app to that.

When creating a new project, you _should_ create a new repo, but you may skip creating a RNGS.io doc if you have an existing one or are using Google Docs for content.

Copy any components or stylesheets you made or changed from the `src/lib/` directory into the new project, as well as any static files (images, etc.) in `src/statics/` and AI files in `project-files/`.

If you didn't create a new RNGS.io doc above, copy the configuration file `rngs-io.json` or `google.json` to your new project.

You _may_ need to also update some components in the `pages/` directory if you changed any code there.

**If your project was created _after_ the 1.0.0 version,** then you can bump the version numbers of the dependencies `@reuters-graphics/graphics-bin` and `@reuters-graphics/graphics-kit-publisher` to the latest version in `package.json` and reinstall with `pnpm i`.

![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

# Metadata

## package.json

Most metadata for your project is stored in a `reuters` key in `package.json`.

The kit will prompt you for essential metadata when you first run `yarn upload` and save it in the appropriate structure.

#### Restarting a graphics pack

If for some reason your upload to the graphics server gets mangled, and you need to start again, creating a new graphics pack, simply set the `reuters.graphics.pack` key to `null`, delete all items in `reuters.graphics.mediaEditions` array and re-run `yarn upload`.

## Locale-specific metadata

The kit expects a few pieces of metadata to be stored in locale-specific directories under `locales/`.

At minimum, you should have a `locales/en/content.json` which includes the following keys and values:

- `SEOTitle`
- `SEODescription`
- `ShareTitle`
- `ShareDescription`

For additional locales, add another `content.json` under a two-letter locale code directory, e.g., `locales/de/content.json`, with the same keys.

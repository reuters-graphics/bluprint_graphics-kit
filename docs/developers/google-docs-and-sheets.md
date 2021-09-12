![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

[🏠 Docs](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/docs/developers/README.md) / **Google docs and sheets**

# Google docs and sheets

The kit uses the `get-google-docs` command in our [graphics-bin](https://github.com/reuters-graphics/graphics-bin) CLI to fetch data from Google docs and sheets.

The config file is located at the root of the project in `google.json`. Read more in [graphics-bin's docs](https://github.com/reuters-graphics/graphics-bin/blob/master/docs/get-google-docs.md) about configuring Google docs and sheets.

On starting a new project, the kit will create a basic Google doc connected to this project and configure it to download to `locales/en/content.json`.

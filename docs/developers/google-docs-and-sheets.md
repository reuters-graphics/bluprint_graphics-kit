![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

[🏠 Docs](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/docs/developers/README.md) / **Google docs and sheets**

# Google docs and sheets

The kit uses the `get-google-docs` command in our [graphics-bin](https://github.com/reuters-graphics/graphics-bin) CLI to fetch data from Google docs and sheets.

The config file is located at the root of the project in `google.json`. 

On starting a new project, the kit will create a basic Google doc connected to this project and configure it to download to `locales/en/content.json`.

### Google docs config

You Google docs config file should include the ID from the Google doc or sheet and the path to files you'd like data from those docs to be written to in your project.

```javascript
{
  "docs": {
    "locales/en/content.json": "XXXX_Google_doc_ID_XXXX"
  },
  "sheets": {
    "src/lib/components/MyChart/data.json": "XXXX_Google_sheet_ID_XXXX"
  }
}
```

To find the ID of your doc or sheet, look for a long string of random characters in the URL of the file in Google Drive. For example:

<https://docs.google.com/spreadsheets/d/>**1h1O8jPSyzrUg-xmolKGSPzaePgyG3zbBkCWiijEpi0c**/edit

Read more in [graphics-bin's docs](https://github.com/reuters-graphics/graphics-bin/blob/master/docs/get-google-docs.md) about more advanced configurations.

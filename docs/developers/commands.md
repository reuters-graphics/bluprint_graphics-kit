![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

[🏠 Docs](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/docs/developers/README.md) / **Basic commands**


# Commands

- [Development and publishing commands](#development-and-publishing-commands)
- [Google docs](#google-docs)

## Development and publishing commands

🚀 Start the development server

```
yarn start
```

👀 Build and publish preview pages to AWS

```
yarn preview
```

⏫ Build and upload your project to the RNGS server

```
yarn upload
```

🍻 Publish your project in the RNGS server

```
yarn pub
```

<sup>❌ _NOT_ `yarn publish`!</sup>

## Google docs

### Get data from Google docs and sheets

Fill out your conf in `google.json` with the Google doc/sheet ID and the path to the file you'd like to export data to. Read more in [Google Docs and Sheets](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/docs/developers/google-docs-and-sheets.md).

```
yarn get-google
```

### Lock data schema for Google data

When you're ready to lock in your Google data structure, you can run a command that will create JSON schema that will check the data pulled from your Google docs will always conform to your schema. [Read more here.](https://github.com/reuters-graphics/graphics-bin/blob/master/docs/lock-google-docs.md#lock-google-docs)

```
yarn lock-google
```

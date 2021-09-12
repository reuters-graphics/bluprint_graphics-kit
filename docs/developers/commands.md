![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

# Commands

- [Development and publishing commands](#development-and-publishing-commands)
  - [Starting the development server](#starting-the-development-server)
  - [Build and publish preview pages to AWS](#build-and-publish-preview-pages-to-aws)
  - [Build and upload your project to the RNGS server](#build-and-upload-your-project-to-the-rngs-server)
  - [Publish your project in the RNGS server](#publish-your-project-in-the-rngs-server)
- [Google docs](#google-docs)
  - [Get data from Google docs and sheets](#get-data-from-google-docs-and-sheets)
  - [Lock data schema for Google data](#lock-data-schema-for-google-data)

## Development and publishing commands

### Starting the development server

```
yarn start
```

### Build and publish preview pages to AWS

```
yarn preview
```

### Build and upload your project to the RNGS server

```
yarn upload
```

### Publish your project in the RNGS server

```
yarn pub
```

## Google docs

### Get data from Google docs and sheets

Fill out your conf in `google.json` with the Google doc/sheet ID and the path to the file you'd like to export data to. [Read more here.](https://github.com/reuters-graphics/graphics-bin/blob/master/docs/get-google-docs.md#conf)

```
yarn get-google
```

### Lock data schema for Google data

When you're ready to lock in your Google data structure, you can run a command that will create JSON schema that will check the data pulled from your Google docs will always conform to your schema. [Read more here.](https://github.com/reuters-graphics/graphics-bin/blob/master/docs/lock-google-docs.md#lock-google-docs)

```
yarn lock-google
```

![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

# Graphics client docs

Reuters graphics can be completely customized to suit the needs of your site and built to host on your servers by editing the source code directly.

## Getting started

You'll need a code editor and a compatible version of [Node](https://nodejs.org/en/) installed on your computer. (The minimum version of Node will be specified in the `engines` field in the `package.json` file in the root of the project.)

Unzip the project archive, navigate to the root of the project (where `package.json` lives) in a terminal and then install the project dependencies using a Node package manager like `npm` or [`yarn`](https://yarnpkg.com/).

```
npm install
```

After dependencies are installed, you can start a development server to preview changes as you make them to the project.

```
npm start
```

Read more about how to make changes to the project's source code by reading the [Graphics developer docs](../developers/README.md).

## Building for self-hosting

When you're ready to publish the project, change the `homepage` prop in `package.json` to the URL where you'd like to host the files.

```javascript
// package.json
{
  // ...
  "homepage": "https://your-site.com/this-project/"
}
```

Then run the `build` script in your terminal:

```
npm run build
```

The files you'll need to host on your server will be built in the `dist` directory of the project. They'll look something like this:

```
dist/
  cdn/
  embeds/
  index.html
```

You're now ready to upload the project to your server. Be sure to upload _all_ the files in the `dist` directory to the location on your server you specified in `homepage` in `package.json`.

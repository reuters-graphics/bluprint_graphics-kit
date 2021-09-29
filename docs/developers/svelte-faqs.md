![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

[🏠 Docs](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/docs/developers/README.md) / **FAQs**

# Svelte FAQs

### Getting a lot of "...is not a valid SSR component" 500 errors

SSR, or server-side rendering, is the process of running your Svelte code in Node _before_ it's sent to the browser, which let's your page initially load with all the markup that should be created by your code without needing to wait for that code to run.

SSR is still an experimental feature in Vite and isn't strictly necessary for us because we serve our code as static files instead of from a live server.

If you're getting lots of 500 errors about such and such not being a "valid SSR component," which can be cleared with a browser refresh, you _may_ want to disable SSR so that it doesn't keep triggering that error (often due to older dependencies like pre-7.0 d3.js in dependencies).

You can disable it in the svelte.config.js by uncommenting [this line](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/svelte.config.js#L42).

That said, your code still needs to be able to run in a Node context to be able to "prerender" your markup when we build out the HTML from your project. Disabling SSR may mask problems with your code you may then only find when you try to build your project for preview or to upload to the graphics server. Keep that in mind if you do disable SSR.

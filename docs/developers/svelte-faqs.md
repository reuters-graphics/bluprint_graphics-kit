![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

[🏠 Docs](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/docs/developers/README.md) / **FAQs**

# Svelte FAQs


### How do I use non-Svelte stuff in Svelte?

Svelte, like all modern JS frameworks, can seem pretty greedy, as though you need to do _everything_ in Svelte. And while there are big advantages to doing _as much as you can_ in Svelte -- including site performance, code organization and lots more -- there's also always a simple pattern you can use as an escape hatch to work with non-Svelte libraries and APIs.

The general idea is to let Svelte create a _container_ and then hook into that container after it's mounted with your third party library and fill it in.

Let's say we have a library `svelteless` that has a `makeHtmlIn` function that gets passed a div and then puts some HTML in it.

We'll make a container for our svelteless library in Svelte, and then use that component's [`onMount`](https://svelte.dev/tutorial/onmount) function to ensure the div has "mounted" -- i.e., that Svelte has put it on the page -- and pass that to `makeHtmlIn`.

```svelte
<script>
import { onMount } from 'svelte';
import Svelteless from 'svelteless';

onMount(() => {
  const container = document.getElementById('my-container');
  
  Svelteless.makeHtmlIn(container);
});
</script>

<div id='my-container'></div>
```

This same pattern is how we work with libraries like d3.js:

```svelte
<script>
import { onMount } from 'svelte';
import * as d3 from 'd3';

onMount(() => {
  const container = document.getElementById('my-container');
  
  d3.select(container)
    .append('svg');
  // ...
});
</script>

<div id='my-container'></div>
```

You can follow this pattern for most non-Svelte libs or to use standard JavaScript APIs like canvas and more within Svelte components pretty seemlessly.

### Getting a lot of "...is not a valid SSR component" 500 errors in SvelteKit

SSR, or server-side rendering, is the process of running your Svelte code in Node _before_ it's sent to the browser, which let's your page initially load with all the markup that should be created by your code without needing to wait for that code to run.

SSR is still an experimental feature in Vite and isn't strictly necessary for us because we serve our code as static files instead of from a live server.

If you're getting lots of 500 errors about such and such not being a "valid SSR component," which can be cleared with a browser refresh, you _may_ want to disable SSR so that it doesn't keep triggering that error (often due to older dependencies like pre-7.0 d3.js in dependencies).

You can disable it in the svelte.config.js by uncommenting [this line](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/svelte.config.js#L42).

That said, your code still needs to be able to run in a Node context to be able to "prerender" your markup when we build out the HTML from your project. Disabling SSR may mask problems with your code you may then only find when you try to build your project for preview or to upload to the graphics server. Keep that in mind if you do disable SSR.

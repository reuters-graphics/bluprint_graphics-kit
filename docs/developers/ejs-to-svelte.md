![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

[🏠 Docs](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/docs/developers/README.md) / **Transitioning from EJS to Svelte**

# Transitioning from EJS to Svelte

This doc includes some examples of how basic things you may have done in the previous rig using EJS can be done in Svelte.

> 💡 **Pro tip:** You can install [Svelte snippets](https://marketplace.visualstudio.com/items?itemName=fivethree.vscode-svelte-snippets) in VSCode, which will suggest simple code blocks as you write and should help you while you're learning.

[📖 Read the docs: for each block](https://svelte.dev/tutorial/each-blocks)

![](https://user-images.githubusercontent.com/12295494/140286773-97eeb3e4-f3fa-427f-a426-1735b0723528.jpg 'for-loop')

[📖 Read the docs: if block](https://svelte.dev/tutorial/if-blocks)

![](https://user-images.githubusercontent.com/12295494/140286794-3b4210a0-125d-4526-9615-cf45b5557afd.jpg 'if-else')

## Importing data

##### EJS

```ejs
<% const content = require('./myData.json'); %>

<h1><%= content.title %></h1>
```

##### Svelte

```svelte
<script>
  import content from './myData.json';
</script>

<h1>{content.title}</h1>
```

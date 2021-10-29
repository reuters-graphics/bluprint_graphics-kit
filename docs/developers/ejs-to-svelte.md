![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

[🏠 Docs](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/docs/developers/README.md) / **Transitioning from EJS to Svelte**

# Transitioning from EJS to Svelte

This doc includes some examples of how basic things you may have done in the previous rig using EJS can be done in Svelte.

> 💡 **Pro tip:** You can install [Svelte snippets](https://marketplace.visualstudio.com/items?itemName=fivethree.vscode-svelte-snippets) in VSCode, which will suggest simple code blocks as you write and should help you while you're learning.

- [For loops](#for-loops)
- [If/else](#ifelse)
- [Importing data](#importing-data)

## For loops

##### EJS

```ejs
<ul>
  <% users.forEach(function(user){ %>
    <li><%= user.name %></li>
  <% }); %>
</ul>
```

##### Svelte

[📖 Read the docs](https://svelte.dev/tutorial/each-blocks)

![](../../src/statics/images/docs-ai-ps/if-for.jpg 'ejs to svelte for each and if else blocks')

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

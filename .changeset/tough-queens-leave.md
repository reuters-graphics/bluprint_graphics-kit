---
'@reuters-graphics/graphics-kit': patch
---

Adds additional context for VS Code Copilot, including llms.txt and repository custom instructions.

[llms.txt](https://llmstxt.org/) is a new standard for providing context to Large Language Models like those used by Microsoft Copilot. It's particularly useful for tailoring prompt responses to particular conventions you want the model to consider or adhere to.

This update adds the [small context window llms.txt for Svelte and SvelteKit](https://svelte.dev/docs/llms), helping LLMs respond, for example, with Svelte 5 syntax which may not yet be part of the model's training data.

This update also adds an llms.txt describing our components library, [@reuters-graphics/graphics-components](https://reuters-graphics.github.io/graphics-components/). It outlines the usual conventions we follow when adding graphics components to our pages, including how we write the content fed to a component's props in RNGS.io.

[Repository custom instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot) are a new feature in VS Code we can use to tell Copilot to refer to our llms.txt files.

What's that all mean for _you_? ...

### ✨ Try it out!

Open up a new Copilot chat window and try a prompt like:

> How can I add an AI graphic component called myMap.svelte to my page?

You should get a response showing how to correctly add the AI graphic component to `App.svelte` in the `content.blocks` loop AND examples of how to write the block that feeds that component in RNGS.io.

### 📢 Open call for contributions

Is there a particular task you're always tripping over in the graphics kit that you'd like an LLM to know how to do when you're asking for help?

Make a [new issue](https://github.com/reuters-graphics/bluprint_graphics-kit/issues) on the graphics kit repo telling us what that is, and we'll work on adding examples of how to do it right to our llms.txt files.

![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

[🏠 Docs](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/docs/developers/README.md) / **AI graphics**

# Adobe Illustrator graphics

To embed Adobe Illustrator graphics in Svelte components, we use a modified version of the [ai2html](http://ai2html.org/) script, which can be found in our [ai2svelte](https://github.com/reuters-graphics/ai2svelte/) repo.

Once you've copied [ai2svelte.js](https://github.com/reuters-graphics/ai2svelte/blob/master/ai2svelte.js) into the Illustrator folder where scripts are located, you'll need to configure the ai2html settings included in the default [Reuters AI template](https://github.com/reuters-graphics/style-ai-templates) (located in `project-files/` by default).

For a **quick start**, you can replace the entire settings block in your AI file with the text below:

```
ai2html-settings
image_format: png24
responsiveness: dynamic
output:one-file
html_output_path: ../src/lib/ai2svelte/
html_output_extension: .svelte
image_output_path: ../../statics/images/graphics/
image_source_path: images/graphics/
png_transparent:yes
png_number_of_colors: 256
jpg_quality: 70
graphicskit: yes
```

For reference, here are the _specific_ settings that must be changed for the graphics kit:

```
html_output_path: ../src/lib/ai2svelte/
html_output_extension: .svelte
image_output_path: ../../statics/images/graphics/
image_source_path: images/graphics/
include_resizer_widths: no
include_resizer_script: no
graphicskit: yes
```

Otherwise, the basic [ai2html](http://ai2html.org/) settings work as expected, but there are additional graphics kit settings to know about:

- **graphicskit** adds or removes the [asset prefix](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/docs/developers/media.md#how-to-use-media-files-in-your-code) required to reference image files in this kit.
  - `yes` (default) adds the asset prefix (using SvelteKit's [assets path store](https://kit.svelte.dev/docs#modules-$app-paths)) to all image paths
  - `no` removes the asset prefix

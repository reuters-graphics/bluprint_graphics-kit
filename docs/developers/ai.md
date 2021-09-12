![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

[🏠 Docs](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/docs/developers/README.md) / **AI graphics**

# Adobe Illustrator graphics

Create an Illustrator graphic using the default [Reuters templates](https://github.com/reuters-graphics/ai2html/tree/master/Reuters-Template).

To export Illustrator graphics using [ai2svelte](https://github.com/reuters-graphics/ai2html/blob/master/ai2svelte.js) in the graphics kit, you'll need to update the defualt settings in your AI file.

For a **quick start**, you can replace the entire settings block in your AI file with the text below:

```
ai2html-settings
image_format: png24
responsiveness: dynamic
output:one-file
html_output_path: ../src/lib/ai2html/
html_output_extension: .svelte
image_output_path: ../../statics/images/graphics/
image_source_path: images/graphics/
png_transparent:yes
png_number_of_colors: 256
jpg_quality: 70
graphicskit: yes
```

For reference, here are the settings specific to the svelte graphics kit that change from the default Illustrator template:

```
html_output_path: ../src/lib/ai2html/
html_output_extension: .svelte
image_output_path: ../../statics/images/graphics/
image_source_path: images/graphics/
include_resizer_widths: no
include_resizer_script: no
graphicskit: yes
```

The basic [ai2html](http://ai2html.org/) settings work as expected, but there are additional graphics kit settings to know about:

- **graphicskit** allows adds or removes the asset pathing
  - Possible values `no` or `yes`
  - Default `yes`
  - `no` removes asset store reference used for source pathing in graphics kit rig
  - `yes` adds the asset store reference used for source pathing in graphics kit rig

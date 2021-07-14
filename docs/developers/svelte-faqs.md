![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

# Svelte FAQs


- [How do I use d3.js?](#how-do-i-use-d3-js)

---

### How do I use d3.js?

D3.js recently released version [7.0.0](https://github.com/d3/d3/releases/tag/v7.0.0), which re-bundled all d3 submodules as ES modules.

Unfortunately, [circular dependencies](https://github.com/d3/d3-selection/issues/168) in d3 itself are not [currently handled](https://github.com/vitejs/vite/issues/2491) by Vite, which is the bundler SvelteKit uses.

For now, **use d3 version `6.7.0` or less**, which still bundles CommonJS modules that are supported by Vite's [prebundling feature](https://vitejs.dev/guide/dep-pre-bundling.html#dependency-pre-bundling).

We generally also recommend that you **use imports for individual modules in D3**, instead of the default bundle. This becomes essential if you're adding any functionality to `d3.selection` by prototyping it, which will not build when you try to publish.

For example, this is how you might setup imports for a simple chart:

```javascript
import * as d3 from 'd3-selection';

import { axisBottom, axisLeft } from 'd3-axis';
import { appendSelect } from 'd3-appendselect';
import { scaleLinear } from 'd3-scale';

d3.selection.prototype.appendSelect = appendSelect;
```

For contrast, this example **will not build**:

```javascript
import * as d3 from 'd3'; // ❌ Don't use the default import.
import { appendSelect } from 'd3-appendselect';

d3.selection.prototype.appendSelect = appendSelect;
```

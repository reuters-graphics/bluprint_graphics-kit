---
'@reuters-graphics/graphics-kit': patch
---

Adds LogBlock component for printing warnings and info messages on a page in development.

```svelte
<script>
  import LogBlock from '$lib/components/dev/LogBlock.svelte';
</script>

<LogBlock message="A red warning message to the user" />

<LogBlock level="info" message="A softer info message" />
```

... and adds info LogBlocks for ad spots in development.

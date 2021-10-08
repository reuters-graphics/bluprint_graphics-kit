![](https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg)

[🏠 Docs](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/docs/developers/README.md) / **Working with data**

# Working with data

Data drives pages. This guide outlines how to work with different types of data, depending on the role your data plays in your project.

- [Static vs. dynamic data](#static-vs-dynamic-data)
- [Data file types](#data-file-types)
- [Where to put your static data](#where-to-put-your-static-data)

## Static vs. dynamic data

The first question you should ask about your data is: Is my data *static* or *dynamic*?

What do we mean?

**Static data** is data that isn't going to change beyond the point you publish your project. The text you pull into your project from a Google doc is an example of this kind of data. That text may change while you're developing the project (getting it edited, etc.), but once you publish, it's locked in, and any changes to the data from there will mean you need to republish the project.

This is the main type of data we'll talk about working with.

**Dynamic data** is data that you expect *will change* after you publish your project. Tracking projects often use this type of data and fetch it on page load to make sure readers see the latest data on the page.

In general, dynamic data often is published separately from the project you're working on. See our [GitHub scraper bluprint](https://github.com/reuters-graphics/bluprint_github-action-scraper) for an example of setting up a scraper that can independently publish data on a timer that your project can then fetch.

We won't talk as much about this type of data. 

> It's worth noting one alternative pattern we _do_ use for tracking projects using dynamic data. We can setup a project to re-publish from GitHub on a schedule or through an API as data updates. That lets us treat dynamic data as though it were static. Read more about that setup in the [Automated publishing](https://github.com/reuters-graphics/bluprint_graphics-kit/blob/master/docs/developers/automated-publishing.md) doc.

## Data file types

A quick note on data file types. We're not going to cover using data in delimited file formats, e.g., TSV, CSV, or the like.

In general, we recommend converting your data to JSON, we'll talk more about why and how to convert it if your source data comes in one of those formats.

## Where to put your static data

You might be tempted to put static data with other media files like images or fonts and then fetch them in your code, but **don't**.

If your data is indeed static, then it's actually far better to import your data directly into your components because the content that data makes can then be baked out into the page when we build it, which means faster load times and better SEO.

Because we're going to import our data just like a component, we can treat it like code and put it right next to the component that uses it.

Say we have data for a chart, we might have a directly structure like this:

```
src/
  lib/
    my-chart/
      index.svelte
      data.json 👈
    Page.svelte
```

Now you can import your data just like a regular module in the component that uses it:

```svelte
<!-- mychart/index.svelte -->
<script>
  import data from './data.json';
</script>

{#each data as d}
  <div style="width: {d.value}%; background: {d.colour};">{d.name}</div>
{/each}
```

<script>
  import pkg from '$pkg';
  import { getPath } from '$utils/statics';
  import { page } from '$app/stores';
  import get from 'lodash/get.js';
  import imageManifest from '$imgs';
  import urljoin from 'proper-url-join';
  import { browser } from '$app/env';
  import analytics from './analytics';
  import publisherTags from './publisherTags';

  export let seoTitle;
  export let seoDescription;
  export let shareTitle;
  export let shareDescription;
  export let shareImgPath;
  export let lang = 'en';
  export let hostname = 'graphics.reuters.com';

  const URL = get(pkg, 'homepage')
    ? urljoin(pkg.homepage, $page.path, { trailingSlash: true })
    : get(pkg, 'reuters.preview')
    ? urljoin(pkg.reuters.preview, $page.path, { trailingSlash: true })
    : $page.host
    ? urljoin('https://' + $page.host, $page.path, { trailingSlash: true })
    : `https://${hostname}`;

  // Only fire analytics on prod sites
  if (browser && window.location.host === 'graphics.reuters.com') {
    analytics(URL, seoTitle);
    publisherTags();
  }

  const orgLdJson = {
    '@context': 'http://schema.org',
    '@type': 'NewsMediaOrganization',
    '@id': 'https://www.reuters.com/#publisher',
    name: 'Reuters',
    logo: {
      '@type': 'ImageObject',
      url:
        'https://s3.reutersmedia.net/resources_v2/images/reuters_social_logo.png',
      width: '200',
      height: '200',
    },
    url: 'https://www.reuters.com/',
  };

  const articleLdJson = {
    '@context': 'http://schema.org',
    '@type': 'NewsArticle',
    headline: seoTitle,
    url: URL,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': URL,
    },
    thumbnailUrl: `https://${hostname}` + getPath(shareImgPath),
    image: [
      {
        '@context': 'http://schema.org',
        '@type': 'ImageObject',
        url: `https://${hostname}` + getPath(shareImgPath),
        width: get(imageManifest, `${shareImgPath}.width`, 1200),
        height: get(imageManifest, `${shareImgPath}.height`, 600),
      },
    ],
    publisher: { '@id': 'https://www.reuters.com/#publisher' },
    copyrightHolder: { '@id': 'https://www.reuters.com/#publisher' },
    sourceOrganization: { '@id': 'https://www.reuters.com/#publisher' },
    copyrightYear: new Date().getFullYear(),
    dateCreated: get(pkg, 'reuters.graphic.published'),
    datePublished: get(pkg, 'reuters.graphic.published'),
    dateModified: get(pkg, 'reuters.graphic.updated'),
    author: get(pkg, 'reuters.graphic.authors', []).map(({ name, url }) => ({
      '@type': 'Person',
      name,
      url,
    })),
    articleSection: 'Graphics',
    isAccessibleForFree: true,
    creator: ['Reuters Graphics'],
    keywords: ['Reuters graphics', 'Reuters', 'graphics', 'Interactives'],
  };
</script>

<svelte:head>
  <html lang="{lang}"></html>
  <title>{seoTitle}</title>
  <meta name="description" content="{seoDescription}" />
  <link rel="canonical" href="{URL}" />
  <link
    rel="shortcut icon"
    type="image/x-icon"
    href="https://s3.reutersmedia.net/resources_v2/images/favicon/favicon.ico"
  />
  <link
    rel="icon"
    type="image/png"
    href="https://s3.reutersmedia.net/resources_v2/images/favicon/favicon-16x16.png"
    sizes="16x16"
  />
  <link
    rel="icon"
    type="image/png"
    href="https://s1.reutersmedia.net/resources_v2/images/favicon/favicon-32x32.png"
    sizes="32x32"
  />
  <link
    rel="icon"
    type="image/png"
    href="https://s3.reutersmedia.net/resources_v2/images/favicon/favicon-96x96.png"
    sizes="96x96"
  />

  <meta property="og:url" content="{URL}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="{shareTitle}" itemprop="name" />
  <meta
    property="og:description"
    content="{shareDescription}"
    itemprop="description"
  />
  <meta
    property="og:image"
    content="{`https://${hostname}` + getPath(shareImgPath)}"
    itemprop="image"
  />
  <meta property="og:site_name" content="Reuters" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@ReutersGraphics" />
  <meta name="twitter:creator" content="@ReutersGraphics" />
  <meta name="twitter:domain" content="{`https://${hostname}`}" />
  <meta name="twitter:title" content="{shareTitle}" />
  <meta name="twitter:description" content="{shareDescription}" />
  <meta
    name="twitter:image:src"
    content="{`https://${hostname}` + getPath(shareImgPath)}"
  />

  <meta property="fb:app_id" content="319194411438328" />
  <meta property="fb:admins" content="616167736" />
  <meta property="fb:admins" content="625796953" />
  <meta property="fb:admins" content="571759798" />

  {@html '<script type="application/ld+json" ✂prettier:content✂="JyArIEpTT04uc3RyaW5naWZ5KG9yZ0xkSnNvbikgKyAn">{}</script>'}
  {@html '<script type="application/ld+json" ✂prettier:content✂="JyArIEpTT04uc3RyaW5naWZ5KGFydGljbGVMZEpzb24pICsgJw==">{}</script>'}
</svelte:head>

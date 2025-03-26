import { defineConfig } from '@reuters-graphics/graphics-kit-publisher';

export default defineConfig({
  metadataPointers: {
    pack: {
      rootSlug: false,
      wildSlug: false,
      title: 'locales/en/content.json?story.seoTitle',
      description: 'locales/en/content.json?story.seoDescription',
    },
  },
  publishingLocations: [
    {
      archive: 'public',
      availableLocations: {
        lynx: false,
        connect: false,
      },
    },
    {
      archive: /media-\w{2}-page/,
      availableLocations: {
        lynx: false,
        connect: true,
      },
    },
  ],
  archiveEditions: {
    docs: {
      'README.txt': 'bin/connect-docs/README.txt',
      'EMBED.txt': 'bin/connect-docs/EMBED.txt',
    },
    ignore: ['project-files/'],
  },
});

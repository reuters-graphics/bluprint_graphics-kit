import { defineConfig } from '@reuters-graphics/graphics-kit-publisher';

export default defineConfig({
  metadataPointers: {
    pack: {
      rootSlug: false,
      wildSlug: false,
      title: false,
      description: false,
      byline: 'locales/en/embeds.json?story.authors',
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
  },
});

import { defineConfig } from '@reuters-graphics/graphics-kit-publisher';

export default defineConfig({
  metadataPointers: {
    pack: {
      rootSlug: false,
      wildSlug: false,
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
      'README.txt': 'bin/docs/README.txt',
      'EMBED.txt': 'bin/docs/EMBED.txt',
    },
  },
});

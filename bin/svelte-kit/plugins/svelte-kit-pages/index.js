import fs from 'fs';
import glob from 'glob';
import { normalizePath } from 'vite';
import path from 'path';

const getPkgRoot = () => {
  const PKG_PATH = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(PKG_PATH)) throw new Error('Unable to find package.json in your current working directory. Are you running from the root of your project?');
  return process.cwd();
};

export default function svelteKitPagesPlugin({ base = '/', pages = 'pages' } = {}) {
  const VIRTUAL_MODULE_ID = '@svelte-kit-pages';
  const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID;

  const PAGES_DIR = path.join(getPkgRoot(), pages);

  let FOUND_PAGES = [];

  // Gets paths to pages
  const getPagePaths = () => {
    const pages = glob.sync('**/*.svelte', { cwd: PAGES_DIR });
    // Reset FOUND_PAGES
    FOUND_PAGES = pages.map(embed => normalizePath(path.join(PAGES_DIR, embed)));
    // Remove Svelte-specific extensions
    const pagePaths = pages.map((embed) => {
      const pagePath = path.join(base, embed.replace('.svelte', ''));
      return /\+page$/.test(pagePath) ? pagePath.replace(/\+page$/, '') : pagePath;
    });
    // Return as virtual module
    return `export default ['${pagePaths.join('\', \'')}'];`;
  };

  const reloadModule = (server) => {
    const plugin = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID);
    if (!plugin) return;
    server.moduleGraph.invalidateModule(plugin);
  };

  return {
    name: 'svelte-kit-pages-plugin',

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_VIRTUAL_MODULE_ID;
    },

    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) return getPagePaths();
    },

    configureServer(server) {
      server.watcher.add(normalizePath(PAGES_DIR));
      server.watcher.on('unlink', (f) => {
        const file = normalizePath(f);
        if (FOUND_PAGES.includes(file)) reloadModule(server);
      });
    },

    handleHotUpdate({ server, file }) {
      // If a page is added and not already in pages we've found, reload the plugin...
      if (file.includes(PAGES_DIR) && !FOUND_PAGES.includes(file)) {
        reloadModule(server);
        server.watcher.add(normalizePath(file));
      }
    },
  };
};

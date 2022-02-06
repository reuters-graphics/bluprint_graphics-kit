const glob = require('glob');
const path = require('path');
const fs = require('fs');
const { normalizePath } = require('vite');

const getPkgRoot = () => {
  const PKG_PATH = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(PKG_PATH)) throw new Error('Unable to find package.json in your current working directory. Are you running from the root of your project?');
  return process.cwd();
};

let FOUND_PAGES = [];

// Gets paths to pages in SvelteKit
const getPagePaths = (base = '/', pagesDir = 'pages') => {
  const ROOT = getPkgRoot();
  const PAGES_DIR = path.resolve(ROOT, pagesDir);
  const pages = glob.sync('**/*.svelte', { cwd: PAGES_DIR });
  const pagePaths = pages.map((embed) => {
    const pagePath = path.join(base, embed.replace('.svelte', ''));
    return /index$/.test(pagePath) ? pagePath.replace(/index$/, '') : pagePath;
  });
  FOUND_PAGES = pages.map(embed => path.join(PAGES_DIR, embed));
  return `export default ['${pagePaths.join('\', \'')}'];`;
};

module.exports = function svelteKitPagesPlugin({ base = '/', pages = 'pages' } = {}) {
  const VIRTUAL_MODULE_ID = '@svelte-kit-pages';
  const PAGES_DIR = path.join(process.cwd(), pages);

  return {
    name: 'svelte-kit-pages-plugin',
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return VIRTUAL_MODULE_ID;
      }
    },
    load(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return getPagePaths(base, pages);
      }
    },
    configureServer(server) {
      server.watcher.add(normalizePath(PAGES_DIR));
    },
    handleHotUpdate(hmr) {
      const { server, file } = hmr;
      // If a page is added and not already in pages we've found, reload the plugin...
      if (file.includes(PAGES_DIR) && !FOUND_PAGES.includes(file)) {
        const plugin = server.moduleGraph.getModuleById(VIRTUAL_MODULE_ID);
        server.moduleGraph.invalidateModule(plugin);
      }
    },
  };
};

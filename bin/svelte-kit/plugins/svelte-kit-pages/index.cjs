const glob = require('glob');
const path = require('path');
const fs = require('fs');

const getPkgRoot = () => {
  const PKG_PATH = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(PKG_PATH)) throw new Error('Unable to find package.json in your current working directory. Are you running from the root of your project?');
  return process.cwd();
};

// Gets paths to pages in SvelteKit
const getPagePaths = (base = '/', pagesDir = 'pages') => {
  const ROOT = getPkgRoot();
  const PAGES_DIR = path.resolve(ROOT, pagesDir);
  const pages = glob.sync('**/*.svelte', { cwd: PAGES_DIR });
  const pagePaths = pages.map((embed) => {
    const pagePath = path.join(base, embed.replace('.svelte', ''));
    return /index$/.test(pagePath) ? pagePath.replace(/index$/, '') : pagePath;
  });
  return `export default ['${pagePaths.join('\', \'')}'];`;
};

module.exports = function svelteKitPagesPlugin({ base = '/', pages = 'pages' } = {}) {
  const virtualModuleId = '@svelte-kit-pages';

  return {
    name: 'svelte-kit-pages-plugin',
    resolveId(id) {
      if (id === virtualModuleId) {
        return virtualModuleId;
      }
    },
    load(id) {
      if (id === virtualModuleId) {
        return getPagePaths(base, pages);
      }
    },
  };
};

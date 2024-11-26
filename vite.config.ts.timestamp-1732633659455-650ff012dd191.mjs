// vite.config.ts
import { purgeStyles } from "file:///Users/a6108129/Scripts/bluprint_graphics-kit/node_modules/.pnpm/@reuters-graphics+vite-plugin-purge-styles@0.0.2_vite@5.4.11_@types+node@22.9.1_sass@1.81.0_/node_modules/@reuters-graphics/vite-plugin-purge-styles/dist/index.js";

// bin/svelte-kit/plugins/svelte-kit-pages/index.ts
import fs from "fs";
import { glob } from "file:///Users/a6108129/Scripts/bluprint_graphics-kit/node_modules/.pnpm/glob@11.0.0/node_modules/glob/dist/esm/index.js";
import { normalizePath } from "file:///Users/a6108129/Scripts/bluprint_graphics-kit/node_modules/.pnpm/vite@5.4.11_@types+node@22.9.1_sass@1.81.0/node_modules/vite/dist/node/index.js";
import path from "path";
var getPkgRoot = () => {
  const PKG_PATH = path.join(process.cwd(), "package.json");
  if (!fs.existsSync(PKG_PATH)) {
    throw new Error(
      "Unable to find package.json in your current working directory. Are you running from the root of your project?"
    );
  }
  return process.cwd();
};
function svelteKitPagesPlugin({
  base = "/",
  pages = "pages"
} = {}) {
  const VIRTUAL_MODULE_ID = "@svelte-kit-pages";
  const RESOLVED_VIRTUAL_MODULE_ID = "\0" + VIRTUAL_MODULE_ID;
  const PAGES_DIR = path.join(getPkgRoot(), pages);
  let FOUND_PAGES = [];
  const getPagePaths = () => {
    const pages2 = glob.sync("**/*.svelte", { cwd: PAGES_DIR });
    FOUND_PAGES = pages2.map(
      (embed) => normalizePath(path.join(PAGES_DIR, embed))
    );
    const pagePaths = pages2.map((embed) => {
      const pagePath = path.join(base, embed.replace(".svelte", ""));
      return /\+page$/.test(pagePath) ? pagePath.replace(/\+page$/, "") : pagePath;
    });
    return `export default ['${pagePaths.join("', '")}'];`;
  };
  const reloadModule = (server) => {
    const plugin = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID);
    if (!plugin) return;
    server.moduleGraph.invalidateModule(plugin);
  };
  return {
    name: "svelte-kit-pages-plugin",
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_VIRTUAL_MODULE_ID;
    },
    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) return getPagePaths();
    },
    configureServer(server) {
      server.watcher.add(normalizePath(PAGES_DIR));
      server.watcher.on("unlink", (f) => {
        const file = normalizePath(f);
        if (FOUND_PAGES.includes(file)) reloadModule(server);
      });
    },
    handleHotUpdate({ server, file }) {
      if (file.includes(PAGES_DIR) && !FOUND_PAGES.includes(file)) {
        reloadModule(server);
        server.watcher.add(normalizePath(file));
      }
    }
  };
}

// vite.config.ts
import { sveltekit } from "file:///Users/a6108129/Scripts/bluprint_graphics-kit/node_modules/.pnpm/@sveltejs+kit@2.8.1_@sveltejs+vite-plugin-svelte@3.1.2_svelte@4.2.19_vite@5.4.11_@types+node@_2she3ggfzrvjaxsv5izhg64fua/node_modules/@sveltejs/kit/src/exports/vite/index.js";
var config = {
  build: { target: "es2015" },
  server: {
    open: true,
    port: 3e3,
    fs: {
      allow: ["."]
    }
  },
  css: {
    preprocessorOptions: { scss: { quietDeps: true, api: "modern-compiler" } }
  },
  plugins: [
    sveltekit(),
    svelteKitPagesPlugin(),
    purgeStyles({
      safeFiles: ["src/lib/styles/**/*.scss"]
    })
  ]
};
var vite_config_default = config;
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiYmluL3N2ZWx0ZS1raXQvcGx1Z2lucy9zdmVsdGUta2l0LXBhZ2VzL2luZGV4LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2E2MTA4MTI5L1NjcmlwdHMvYmx1cHJpbnRfZ3JhcGhpY3Mta2l0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYTYxMDgxMjkvU2NyaXB0cy9ibHVwcmludF9ncmFwaGljcy1raXQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2E2MTA4MTI5L1NjcmlwdHMvYmx1cHJpbnRfZ3JhcGhpY3Mta2l0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgcHVyZ2VTdHlsZXMgfSBmcm9tICdAcmV1dGVycy1ncmFwaGljcy92aXRlLXBsdWdpbi1wdXJnZS1zdHlsZXMnO1xuaW1wb3J0IHN2ZWx0ZUtpdFBhZ2VzUGx1Z2luIGZyb20gJy4vYmluL3N2ZWx0ZS1raXQvcGx1Z2lucy9zdmVsdGUta2l0LXBhZ2VzLyc7XG5pbXBvcnQgeyBzdmVsdGVraXQgfSBmcm9tICdAc3ZlbHRlanMva2l0L3ZpdGUnO1xuaW1wb3J0IHR5cGUgeyBVc2VyQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5cbmNvbnN0IGNvbmZpZzogVXNlckNvbmZpZyA9IHtcbiAgYnVpbGQ6IHsgdGFyZ2V0OiAnZXMyMDE1JyB9LFxuICBzZXJ2ZXI6IHtcbiAgICBvcGVuOiB0cnVlLFxuICAgIHBvcnQ6IDMwMDAsXG4gICAgZnM6IHtcbiAgICAgIGFsbG93OiBbJy4nXSxcbiAgICB9LFxuICB9LFxuICBjc3M6IHtcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7IHNjc3M6IHsgcXVpZXREZXBzOiB0cnVlLCBhcGk6ICdtb2Rlcm4tY29tcGlsZXInIH0gfSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHN2ZWx0ZWtpdCgpLFxuICAgIHN2ZWx0ZUtpdFBhZ2VzUGx1Z2luKCksXG4gICAgcHVyZ2VTdHlsZXMoe1xuICAgICAgc2FmZUZpbGVzOiBbJ3NyYy9saWIvc3R5bGVzLyoqLyouc2NzcyddLFxuICAgIH0pLFxuICBdLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY29uZmlnO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYTYxMDgxMjkvU2NyaXB0cy9ibHVwcmludF9ncmFwaGljcy1raXQvYmluL3N2ZWx0ZS1raXQvcGx1Z2lucy9zdmVsdGUta2l0LXBhZ2VzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYTYxMDgxMjkvU2NyaXB0cy9ibHVwcmludF9ncmFwaGljcy1raXQvYmluL3N2ZWx0ZS1raXQvcGx1Z2lucy9zdmVsdGUta2l0LXBhZ2VzL2luZGV4LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9hNjEwODEyOS9TY3JpcHRzL2JsdXByaW50X2dyYXBoaWNzLWtpdC9iaW4vc3ZlbHRlLWtpdC9wbHVnaW5zL3N2ZWx0ZS1raXQtcGFnZXMvaW5kZXgudHNcIjtpbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHsgZ2xvYiB9IGZyb20gJ2dsb2InO1xuaW1wb3J0IHsgbm9ybWFsaXplUGF0aCB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgdHlwZSB7IFZpdGVEZXZTZXJ2ZXIgfSBmcm9tICd2aXRlJztcblxuY29uc3QgZ2V0UGtnUm9vdCA9ICgpID0+IHtcbiAgY29uc3QgUEtHX1BBVEggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3BhY2thZ2UuanNvbicpO1xuICBpZiAoIWZzLmV4aXN0c1N5bmMoUEtHX1BBVEgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ1VuYWJsZSB0byBmaW5kIHBhY2thZ2UuanNvbiBpbiB5b3VyIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkuIEFyZSB5b3UgcnVubmluZyBmcm9tIHRoZSByb290IG9mIHlvdXIgcHJvamVjdD8nXG4gICAgKTtcbiAgfVxuICByZXR1cm4gcHJvY2Vzcy5jd2QoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHN2ZWx0ZUtpdFBhZ2VzUGx1Z2luKHtcbiAgYmFzZSA9ICcvJyxcbiAgcGFnZXMgPSAncGFnZXMnLFxufSA9IHt9KSB7XG4gIGNvbnN0IFZJUlRVQUxfTU9EVUxFX0lEID0gJ0BzdmVsdGUta2l0LXBhZ2VzJztcbiAgY29uc3QgUkVTT0xWRURfVklSVFVBTF9NT0RVTEVfSUQgPSAnXFwwJyArIFZJUlRVQUxfTU9EVUxFX0lEO1xuXG4gIGNvbnN0IFBBR0VTX0RJUiA9IHBhdGguam9pbihnZXRQa2dSb290KCksIHBhZ2VzKTtcblxuICBsZXQgRk9VTkRfUEFHRVM6IHN0cmluZ1tdID0gW107XG5cbiAgLy8gR2V0cyBwYXRocyB0byBwYWdlc1xuICBjb25zdCBnZXRQYWdlUGF0aHMgPSAoKSA9PiB7XG4gICAgY29uc3QgcGFnZXMgPSBnbG9iLnN5bmMoJyoqLyouc3ZlbHRlJywgeyBjd2Q6IFBBR0VTX0RJUiB9KTtcbiAgICAvLyBSZXNldCBGT1VORF9QQUdFU1xuICAgIEZPVU5EX1BBR0VTID0gcGFnZXMubWFwKChlbWJlZCkgPT5cbiAgICAgIG5vcm1hbGl6ZVBhdGgocGF0aC5qb2luKFBBR0VTX0RJUiwgZW1iZWQpKVxuICAgICk7XG4gICAgLy8gUmVtb3ZlIFN2ZWx0ZS1zcGVjaWZpYyBleHRlbnNpb25zXG4gICAgY29uc3QgcGFnZVBhdGhzID0gcGFnZXMubWFwKChlbWJlZCkgPT4ge1xuICAgICAgY29uc3QgcGFnZVBhdGggPSBwYXRoLmpvaW4oYmFzZSwgZW1iZWQucmVwbGFjZSgnLnN2ZWx0ZScsICcnKSk7XG4gICAgICByZXR1cm4gL1xcK3BhZ2UkLy50ZXN0KHBhZ2VQYXRoKSA/XG4gICAgICAgICAgcGFnZVBhdGgucmVwbGFjZSgvXFwrcGFnZSQvLCAnJylcbiAgICAgICAgOiBwYWdlUGF0aDtcbiAgICB9KTtcbiAgICAvLyBSZXR1cm4gYXMgdmlydHVhbCBtb2R1bGVcbiAgICByZXR1cm4gYGV4cG9ydCBkZWZhdWx0IFsnJHtwYWdlUGF0aHMuam9pbihcIicsICdcIil9J107YDtcbiAgfTtcblxuICBjb25zdCByZWxvYWRNb2R1bGUgPSAoc2VydmVyOiBWaXRlRGV2U2VydmVyKSA9PiB7XG4gICAgY29uc3QgcGx1Z2luID0gc2VydmVyLm1vZHVsZUdyYXBoLmdldE1vZHVsZUJ5SWQoUkVTT0xWRURfVklSVFVBTF9NT0RVTEVfSUQpO1xuICAgIGlmICghcGx1Z2luKSByZXR1cm47XG4gICAgc2VydmVyLm1vZHVsZUdyYXBoLmludmFsaWRhdGVNb2R1bGUocGx1Z2luKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdzdmVsdGUta2l0LXBhZ2VzLXBsdWdpbicsXG5cbiAgICByZXNvbHZlSWQoaWQ6IHN0cmluZykge1xuICAgICAgaWYgKGlkID09PSBWSVJUVUFMX01PRFVMRV9JRCkgcmV0dXJuIFJFU09MVkVEX1ZJUlRVQUxfTU9EVUxFX0lEO1xuICAgIH0sXG5cbiAgICBsb2FkKGlkOiBzdHJpbmcpIHtcbiAgICAgIGlmIChpZCA9PT0gUkVTT0xWRURfVklSVFVBTF9NT0RVTEVfSUQpIHJldHVybiBnZXRQYWdlUGF0aHMoKTtcbiAgICB9LFxuXG4gICAgY29uZmlndXJlU2VydmVyKHNlcnZlcjogVml0ZURldlNlcnZlcikge1xuICAgICAgc2VydmVyLndhdGNoZXIuYWRkKG5vcm1hbGl6ZVBhdGgoUEFHRVNfRElSKSk7XG4gICAgICBzZXJ2ZXIud2F0Y2hlci5vbigndW5saW5rJywgKGYpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZSA9IG5vcm1hbGl6ZVBhdGgoZik7XG4gICAgICAgIGlmIChGT1VORF9QQUdFUy5pbmNsdWRlcyhmaWxlKSkgcmVsb2FkTW9kdWxlKHNlcnZlcik7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgaGFuZGxlSG90VXBkYXRlKHsgc2VydmVyLCBmaWxlIH0pIHtcbiAgICAgIC8vIElmIGEgcGFnZSBpcyBhZGRlZCBhbmQgbm90IGFscmVhZHkgaW4gcGFnZXMgd2UndmUgZm91bmQsIHJlbG9hZCB0aGUgcGx1Z2luLi4uXG4gICAgICBpZiAoZmlsZS5pbmNsdWRlcyhQQUdFU19ESVIpICYmICFGT1VORF9QQUdFUy5pbmNsdWRlcyhmaWxlKSkge1xuICAgICAgICByZWxvYWRNb2R1bGUoc2VydmVyKTtcbiAgICAgICAgc2VydmVyLndhdGNoZXIuYWRkKG5vcm1hbGl6ZVBhdGgoZmlsZSkpO1xuICAgICAgfVxuICAgIH0sXG4gIH07XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlULFNBQVMsbUJBQW1COzs7QUNBZ0YsT0FBTyxRQUFRO0FBQ3BiLFNBQVMsWUFBWTtBQUNyQixTQUFTLHFCQUFxQjtBQUM5QixPQUFPLFVBQVU7QUFHakIsSUFBTSxhQUFhLE1BQU07QUFDdkIsUUFBTSxXQUFXLEtBQUssS0FBSyxRQUFRLElBQUksR0FBRyxjQUFjO0FBQ3hELE1BQUksQ0FBQyxHQUFHLFdBQVcsUUFBUSxHQUFHO0FBQzVCLFVBQU0sSUFBSTtBQUFBLE1BQ1I7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNBLFNBQU8sUUFBUSxJQUFJO0FBQ3JCO0FBRWUsU0FBUixxQkFBc0M7QUFBQSxFQUMzQyxPQUFPO0FBQUEsRUFDUCxRQUFRO0FBQ1YsSUFBSSxDQUFDLEdBQUc7QUFDTixRQUFNLG9CQUFvQjtBQUMxQixRQUFNLDZCQUE2QixPQUFPO0FBRTFDLFFBQU0sWUFBWSxLQUFLLEtBQUssV0FBVyxHQUFHLEtBQUs7QUFFL0MsTUFBSSxjQUF3QixDQUFDO0FBRzdCLFFBQU0sZUFBZSxNQUFNO0FBQ3pCLFVBQU1BLFNBQVEsS0FBSyxLQUFLLGVBQWUsRUFBRSxLQUFLLFVBQVUsQ0FBQztBQUV6RCxrQkFBY0EsT0FBTTtBQUFBLE1BQUksQ0FBQyxVQUN2QixjQUFjLEtBQUssS0FBSyxXQUFXLEtBQUssQ0FBQztBQUFBLElBQzNDO0FBRUEsVUFBTSxZQUFZQSxPQUFNLElBQUksQ0FBQyxVQUFVO0FBQ3JDLFlBQU0sV0FBVyxLQUFLLEtBQUssTUFBTSxNQUFNLFFBQVEsV0FBVyxFQUFFLENBQUM7QUFDN0QsYUFBTyxVQUFVLEtBQUssUUFBUSxJQUMxQixTQUFTLFFBQVEsV0FBVyxFQUFFLElBQzlCO0FBQUEsSUFDTixDQUFDO0FBRUQsV0FBTyxvQkFBb0IsVUFBVSxLQUFLLE1BQU0sQ0FBQztBQUFBLEVBQ25EO0FBRUEsUUFBTSxlQUFlLENBQUMsV0FBMEI7QUFDOUMsVUFBTSxTQUFTLE9BQU8sWUFBWSxjQUFjLDBCQUEwQjtBQUMxRSxRQUFJLENBQUMsT0FBUTtBQUNiLFdBQU8sWUFBWSxpQkFBaUIsTUFBTTtBQUFBLEVBQzVDO0FBRUEsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBRU4sVUFBVSxJQUFZO0FBQ3BCLFVBQUksT0FBTyxrQkFBbUIsUUFBTztBQUFBLElBQ3ZDO0FBQUEsSUFFQSxLQUFLLElBQVk7QUFDZixVQUFJLE9BQU8sMkJBQTRCLFFBQU8sYUFBYTtBQUFBLElBQzdEO0FBQUEsSUFFQSxnQkFBZ0IsUUFBdUI7QUFDckMsYUFBTyxRQUFRLElBQUksY0FBYyxTQUFTLENBQUM7QUFDM0MsYUFBTyxRQUFRLEdBQUcsVUFBVSxDQUFDLE1BQU07QUFDakMsY0FBTSxPQUFPLGNBQWMsQ0FBQztBQUM1QixZQUFJLFlBQVksU0FBUyxJQUFJLEVBQUcsY0FBYSxNQUFNO0FBQUEsTUFDckQsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUVBLGdCQUFnQixFQUFFLFFBQVEsS0FBSyxHQUFHO0FBRWhDLFVBQUksS0FBSyxTQUFTLFNBQVMsS0FBSyxDQUFDLFlBQVksU0FBUyxJQUFJLEdBQUc7QUFDM0QscUJBQWEsTUFBTTtBQUNuQixlQUFPLFFBQVEsSUFBSSxjQUFjLElBQUksQ0FBQztBQUFBLE1BQ3hDO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRjs7O0FENUVBLFNBQVMsaUJBQWlCO0FBRzFCLElBQU0sU0FBcUI7QUFBQSxFQUN6QixPQUFPLEVBQUUsUUFBUSxTQUFTO0FBQUEsRUFDMUIsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sSUFBSTtBQUFBLE1BQ0YsT0FBTyxDQUFDLEdBQUc7QUFBQSxJQUNiO0FBQUEsRUFDRjtBQUFBLEVBQ0EsS0FBSztBQUFBLElBQ0gscUJBQXFCLEVBQUUsTUFBTSxFQUFFLFdBQVcsTUFBTSxLQUFLLGtCQUFrQixFQUFFO0FBQUEsRUFDM0U7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLFVBQVU7QUFBQSxJQUNWLHFCQUFxQjtBQUFBLElBQ3JCLFlBQVk7QUFBQSxNQUNWLFdBQVcsQ0FBQywwQkFBMEI7QUFBQSxJQUN4QyxDQUFDO0FBQUEsRUFDSDtBQUNGO0FBRUEsSUFBTyxzQkFBUTsiLAogICJuYW1lcyI6IFsicGFnZXMiXQp9Cg==

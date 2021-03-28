const sveltePreprocess = require('svelte-preprocess');
const pkg = require('./package.json');
const imagetools = require('vite-imagetools');

module.exports = {
	preprocess: sveltePreprocess({
		scss: {
			includePaths: ['src/', 'node_modules/bootstrap/scss/'],
			importer: [
				(url) => {
					// Redirect tilde-prefixed imports to node_modules
					if (/^~/.test(url)) return { file: `node_modules/${url.replace('~', '')}` };
					return null;
				},
			],
		},
		postcss: {
			plugins: [require('autoprefixer')],
		},
	}),
	kit: {
		appDir: '_app',
		paths: {
			assets: process.env.NODE_ENV === 'production' ? pkg.reuters.publishPaths.cdn : '',
			base: process.env.NODE_ENV === 'production' ? pkg.reuters.publishPaths.interactive : '',
		},
		adapter: {
			name: 'static-adapter',
			async adapt(builder) {
				builder.copy_static_files('dist/cdn');
				builder.copy_client_files('dist/cdn');
				await builder.prerender({
					force: true,
					dest: 'dist/interactive',
				});
			}
		},
		files: {
			assets: 'src/statics',
			lib: 'src/lib',
			routes: 'pages',
			template: 'src/template.html',
		},
		target: '',
		vite: {
			build: {
				assetsInlineLimit: 0,
			},
			plugins: [imagetools.imagetools({force: true})],
		}
	}
};

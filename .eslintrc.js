module.exports = {
	root: true,
	extends: ['eslint:recommended', 'prettier'],
	plugins: ['svelte3'],
	env: {
		browser: true,
		node: true
	},
	overrides: [
		{ files: ['*.svelte'], processor: 'svelte3/svelte3' },
	],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2018
	}
};

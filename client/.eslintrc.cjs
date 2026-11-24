module.exports = {
	root: true,
	env: {browser: true, es2020: true},
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended'],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	parser: '@typescript-eslint/parser',
	plugins: ['react-refresh'],
	rules: {
		// The base rule misreports TypeScript parameter names in types; the TS-aware rule below replaces it.
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': 'warn',
		'react-refresh/only-export-components': ['warn', {allowConstantExport: true}],
	},
};

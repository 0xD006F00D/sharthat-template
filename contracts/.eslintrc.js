module.exports = {
	root: true,
	extends: ['standard', 'plugin:prettier/recommended', 'plugin:node/recommended'],
	overrides: [
		{
			files: ['hardhat.config.js'],
			globals: {task: true}
		}
	],
	parserOptions: {
		ecmaVersion: 12
	},
	env: {
		browser: false,
		es2021: true,
		mocha: true,
		node: true
	}
};

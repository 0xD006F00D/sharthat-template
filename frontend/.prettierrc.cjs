//pnpm+svelte+tailwind
//https://github.com/sveltejs/prettier-plugin-svelte/issues/155#issuecomment-831166730
module.exports = {
	...require('../.prettierrc.cjs'),
	plugins: [require('prettier-plugin-tailwindcss')],
	overrides: [
		{
			files: '*.svelte',
			options: { parser: 'svelte' }
		}
	]
};

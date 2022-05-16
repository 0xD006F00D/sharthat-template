import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		prerender: {
			default: true
		},
		trailingSlash: 'always',
		adapter: adapter()
	},
	preprocess: preprocess({
		postcss: true
	})
};

export default config;

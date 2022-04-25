import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import childProcess from 'child_process';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),

		// Override http methods in the Todo forms
		methodOverride: {
			allowed: ['PATCH', 'DELETE']
		},

		vite: {
			define: {
				__GIT_VERSION__: JSON.stringify(
					childProcess.execSync('git rev-parse --short HEAD').toString().trim()
				),
				__GIT_COMMITHASH__: JSON.stringify(
					childProcess.execSync('git rev-parse HEAD').toString().trim()
				)
			}
		}
	}
};

export default config;

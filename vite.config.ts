import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import svgLoader from 'vite-svg-loader'

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue(), vueDevTools(), svgLoader()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			'@packages': fileURLToPath(new URL('./src/packages', import.meta.url)),
			'@ui': fileURLToPath(new URL('./src/packages/ui', import.meta.url)),
			'@icons': fileURLToPath(new URL('./src/packages/icons', import.meta.url)),
			'@core': fileURLToPath(new URL('./src/core', import.meta.url)),
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				// api: 'modern-compiler', // or "modern"
			},
		},
	},
})

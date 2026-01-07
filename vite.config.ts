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
			'@ui-vue': fileURLToPath(new URL('./src/ui-vue', import.meta.url)),
			'@icons': fileURLToPath(new URL('./src/icons', import.meta.url)),
			'@foundation': fileURLToPath(new URL('./src/foundation', import.meta.url)),
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

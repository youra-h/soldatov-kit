import { mergeConfig, defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			environment: 'jsdom',
			include: ['src/plugins/__tests__/**/*.{test,spec}.ts'],
			name: 'plugins',
		},
	}),
)

import { mergeConfig, defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			include: ['src/core/__tests__/**/*.{test,spec}.ts'],
			exclude: ['src/core/__tests__/old/**'],
			name: 'core'
		},
	}),
)

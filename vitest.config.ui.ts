import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['src/packages/__tests__/**/*.{test,spec}.ts'],
		name: 'ui',
	},
})

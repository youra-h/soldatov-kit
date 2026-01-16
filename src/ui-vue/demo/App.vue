<script setup lang="ts">
import { computed, markRaw } from 'vue'
import ComponentViewPlayground from './ComponentViewPlayground.vue'

/**
 * Playground Manager
 *
 * Как использовать:
 * 1. Измените переменную activePlayground на нужный ключ
 * 2. Сохраните файл - playground переключится автоматически
 *
 * Как добавить новый playground:
 * 1. Создайте <ComponentName>Playground.vue
 * 2. Импортируйте его: import ButtonPlayground from './ButtonPlayground.vue'
 * 3. Добавьте в объект playgrounds: 'button': markRaw(ButtonPlayground)
 * 4. Используйте activePlayground = 'button'
 */

// Маппинг доступных playground компонентов
const playgrounds = {
	'component-view': markRaw(ComponentViewPlayground),
	// Добавьте здесь другие playground по мере создания:
	// 'button': markRaw(ButtonPlayground),
	// 'check-box': markRaw(CheckBoxPlayground),
	// 'switch': markRaw(SwitchPlayground),
} as const

// 🎯 Выберите активный playground, изменив значение этой переменной
const activePlayground = 'component-view' as keyof typeof playgrounds

const CurrentPlayground = computed(() => {
	const component = playgrounds[activePlayground]
	if (!component) {
		console.error(`Playground "${activePlayground}" not found`)
		return null
	}
	return component
})
</script>

<template>
	<div class="min-h-screen bg-gray-50">
		<div v-if="CurrentPlayground" class="container mx-auto">
			<component :is="CurrentPlayground" />
		</div>
		<div v-else class="flex items-center justify-center min-h-screen">
			<div class="text-center">
				<h1 class="text-2xl font-bold text-red-600 mb-2">Playground not found</h1>
				<p class="text-gray-600">Check the activePlayground variable</p>
			</div>
		</div>
	</div>
</template>

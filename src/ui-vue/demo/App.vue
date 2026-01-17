<script setup lang="ts">
import { computed, markRaw } from 'vue'
import ComponentViewPlayground from './ComponentViewPlayground.vue'
import IconPlayground from './IconPlayground.vue'

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
	'icon': markRaw(IconPlayground),
	// Добавьте здесь другие playground по мере создания:
	// 'button': markRaw(ButtonPlayground),
	// 'check-box': markRaw(CheckBoxPlayground),
	// 'switch': markRaw(SwitchPlayground),
} as const

// 🎯 Выберите активный playground, изменив значение этой переменной
const activePlayground = 'icon' as keyof typeof playgrounds

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
	<div class="pg-app">
		<div v-if="CurrentPlayground" class="pg-app__container">
			<component :is="CurrentPlayground" />
		</div>
		<div v-else class="pg-app__error">
			<div class="pg-app__error-content">
				<h1 class="pg-app__error-title">Playground not found</h1>
				<p class="pg-app__error-text">Check the activePlayground variable</p>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@reference "./../../foundation/tailwind/index.css";

.pg-app {
	$this: &;

	@apply min-h-screen;
	@apply bg-gray-50;

	&__container {
		@apply container mx-auto;
	}

	&__error {
		@apply flex items-center justify-center;
		@apply min-h-screen;
	}

	&__error-content {
		@apply text-center;
	}

	&__error-title {
		@apply text-2xl;
		@apply font-bold;
		@apply text-red-600;
		@apply mb-2;
	}

	&__error-text {
		@apply text-gray-600;
	}
}
</style>

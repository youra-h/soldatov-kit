<script setup lang="ts">
import { computed, markRaw, ref } from 'vue'
import ComponentView from './playgrounds/ComponentView.vue'
import Icon from './playgrounds/Icon.vue'
import Spinner from './playgrounds/Spinner.vue'
import Button from './playgrounds/Button.vue'
import CheckBox from './playgrounds/CheckBox.vue'
import Switch from './playgrounds/Switch.vue'
import Tabs from './playgrounds/Tabs.vue'
import EventLog from './common/EventLog.vue'
import type { EventLogEntry } from './common/EventLog.vue'

/**
 *  Manager
 *
 * Как добавить новый playground:
 * 1. Создайте <ComponentName>.vue
 * 2. Импортируйте его: import Button from './Button.vue'
 * 3. Добавьте в объект playgrounds с label
 */

// Маппинг доступных playground компонентов
const playgrounds = {
	'component-view': { component: markRaw(ComponentView), label: 'ComponentView' },
	icon: { component: markRaw(Icon), label: 'Icon' },
	spinner: { component: markRaw(Spinner), label: 'Spinner' },
	button: { component: markRaw(Button), label: 'Button' },
	'check-box': { component: markRaw(CheckBox), label: 'CheckBox' },
	switch: { component: markRaw(Switch), label: 'Switch' },
	tabs: { component: markRaw(Tabs), label: 'Tabs' },
} as const

// Активный playground (можно управлять через меню)
const active = ref<keyof typeof playgrounds>('tabs')

// View mode: 'sandbox' | 'logs'
const activeView = ref<'sandbox' | 'logs'>('sandbox')

// Централизованное хранилище логов
const eventLog = ref<EventLogEntry[]>([])

const handleLog = (entry: EventLogEntry) => {
	eventLog.value.unshift(entry)
	// Keep only last 200 events
	if (eventLog.value.length > 200) {
		eventLog.value = eventLog.value.slice(0, 200)
	}
}

const handleClearLogs = () => {
	eventLog.value = []
}

const Current = computed(() => {
	const playground = playgrounds[active.value]
	if (!playground) {
		console.error(` "${active.value}" not found`)
		return null
	}
	return playground.component
})

// Получить список доступных playground для меню
const playgroundList = computed(() => {
	return Object.entries(playgrounds).map(([key, value]) => ({
		key: key as keyof typeof playgrounds,
		label: value.label,
	}))
})
</script>

<template>
	<div class="pg-app">
		<!-- Navigation -->
		<div class="pg-app__nav">
			<button
				:class="[
					'pg-app__nav-btn',
					{ 'pg-app__nav-btn--active': activeView === 'sandbox' },
				]"
				@click="activeView = 'sandbox'"
			>
				Sandbox
			</button>
			<button
				:class="['pg-app__nav-btn', { 'pg-app__nav-btn--active': activeView === 'logs' }]"
				@click="activeView = 'logs'"
			>
				Logs ({{ eventLog.length }})
			</button>
		</div>

		<div class="pg-app__layout">
			<!-- Sidebar Menu -->
			<aside class="pg-app__sidebar">
				<h3 class="pg-app__sidebar-title">Components</h3>
				<nav class="pg-app__menu">
					<button
						v-for="item in playgroundList"
						:key="item.key"
						:class="[
							'pg-app__menu-item',
							{ 'pg-app__menu-item--active': active === item.key },
						]"
						@click="active = item.key"
					>
						{{ item.label }}
					</button>
				</nav>
			</aside>

			<!-- Main Content -->
			<main class="pg-app__main">
				<!-- Sandbox View -->
				<div v-if="activeView === 'sandbox'" class="pg-app__content">
					<div v-if="Current" class="pg-app__container">
						<component :is="Current" @log="handleLog" />
					</div>
					<div v-else class="pg-app__error">
						<div class="pg-app__error-content">
							<h1 class="pg-app__error-title">not found</h1>
							<p class="pg-app__error-text">Check the active variable</p>
						</div>
					</div>
				</div>

				<!-- Logs View -->
				<div v-else-if="activeView === 'logs'" class="pg-app__content">
					<div class="pg-app__logs">
						<EventLog :events="eventLog" @clear="handleClearLogs" />
					</div>
				</div>
			</main>
		</div>
	</div>
</template>

<style lang="scss">
@reference "./../../foundation/tailwind/index.css";

.pg-app {
	$this: &;

	@apply min-h-screen;
	@apply bg-gray-50;

	&__nav {
		@apply flex gap-2;
		@apply bg-white;
		@apply border-b border-gray-200;
		@apply px-4 py-2;
		@apply sticky top-0;
		@apply z-10;
	}

	&__nav-btn {
		@apply px-4 py-2;
		@apply text-sm font-medium;
		@apply text-gray-600;
		@apply rounded-md;
		@apply transition-colors;
		@apply hover:bg-gray-100;

		&--active {
			@apply bg-blue-100;
			@apply text-blue-700;
			@apply hover:bg-blue-200;
		}
	}

	&__layout {
		@apply flex;
		@apply min-h-[calc(100vh-49px)];
	}

	&__sidebar {
		@apply w-64;
		@apply bg-white;
		@apply border-r border-gray-200;
		@apply p-4;
		@apply flex-shrink-0;
	}

	&__sidebar-title {
		@apply text-sm font-semibold;
		@apply text-gray-700;
		@apply mb-3;
		@apply px-2;
	}

	&__menu {
		@apply flex flex-col;
		@apply gap-1;
	}

	&__menu-item {
		@apply px-3 py-2;
		@apply text-sm;
		@apply text-gray-700;
		@apply rounded-md;
		@apply text-left;
		@apply transition-colors;
		@apply hover:bg-gray-100;

		&--active {
			@apply bg-blue-50;
			@apply text-blue-700;
			@apply font-medium;
		}
	}

	&__main {
		@apply flex-1;
		@apply overflow-auto;
	}

	&__content {
		@apply min-h-full;
	}

	&__container {
		@apply container mx-auto;
	}

	&__logs {
		@apply container mx-auto;
		@apply p-4;
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

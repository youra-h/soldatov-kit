<script setup lang="ts">
import { ref } from 'vue'
import PlaygroundLayout from './../layouts/PlaygroundLayout.vue'
import Properties from './../common/Properties.vue'
import type { TPropertiesSchema } from './../common/Properties.vue'
import SlotsDemo from './../components/frame/Slots.vue'

// Схема свойств для Frame
const propertiesSchema: TPropertiesSchema = {
	customX: { type: 'number', default: 50 },
	customY: { type: 'number', default: 50 },
	width: { type: 'number', default: 280 },
	height: { type: 'number', default: 180 },
	position: {
		type: 'select',
		default: 'fixed',
		options: ['fixed', 'absolute'],
	},
}

// Component properties state
const componentProps = ref<{
	customX: number
	customY: number
	width: number | string
	height: number | string
	position: string
}>({
	customX: 50,
	customY: 50,
	width: 280,
	height: 180,
	position: 'fixed',
})
</script>

<template>
	<PlaygroundLayout title="Frame Playground">
		<template #properties>
			<Properties v-model="componentProps" :schema="propertiesSchema" />
		</template>

		<template #slots-demo>
			<SlotsDemo v-bind="componentProps" />
		</template>
	</PlaygroundLayout>
</template>

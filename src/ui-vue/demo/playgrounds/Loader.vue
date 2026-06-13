<script setup lang="ts">
import { ref } from 'vue'
import PlaygroundLayout from './../layouts/PlaygroundLayout.vue'
import Properties from './../common/Properties.vue'
import type { TPropertiesSchema } from './../common/Properties.vue'
import SlotsDemo from './../components/loader/Slots.vue'
import { SIZES, VARIANTS } from '../common/items'
import type { TComponentSize, TComponentVariant } from '@core'

const propertiesSchema: TPropertiesSchema = {
	visible: { type: 'boolean', default: false },
	size: { type: 'select', default: 'normal', options: SIZES },
	variant: { type: 'select', default: 'normal', options: VARIANTS },
	disabled: { type: 'boolean', default: true },
	indicator: { type: 'boolean', default: true },
}

const componentProps = ref<{
	visible: boolean
	size: TComponentSize
	variant: TComponentVariant
	disabled: boolean
	indicator: boolean
}>({
	visible: false,
	size: 'normal',
	variant: 'normal',
	disabled: true,
	indicator: true,
})
</script>

<template>
	<PlaygroundLayout title="Loader Playground">
		<template #properties>
			<Properties v-model="componentProps" :schema="propertiesSchema" />
		</template>

		<template #slots-demo>
			<SlotsDemo
				:visible="componentProps.visible"
				:size="componentProps.size"
				:variant="componentProps.variant"
				:disabled="componentProps.disabled"
				:indicator="componentProps.indicator"
			/>
		</template>
	</PlaygroundLayout>
</template>

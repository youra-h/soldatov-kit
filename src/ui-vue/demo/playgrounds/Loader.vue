<script setup lang="ts">
import { ref } from 'vue'
import PlaygroundLayout from './../layouts/PlaygroundLayout.vue'
import Properties from './../common/Properties.vue'
import type { TPropertiesSchema } from './../common/Properties.vue'
import SlotsDemo from './../components/loader/Slots.vue'
import { SIZES, VARIANTS } from '../common/items'
import type { TComponentSize, TComponentVariant } from '@core'

const propertiesSchema: TPropertiesSchema = {
	size: { type: 'select', default: 'normal', options: SIZES },
	variant: { type: 'select', default: 'normal', options: VARIANTS },
	block: { type: 'boolean', default: true },
	indicator: { type: 'boolean', default: true },
}

const componentProps = ref<{
	size: TComponentSize
	variant: TComponentVariant
	block: boolean
	indicator: boolean
}>({
	size: 'normal',
	variant: 'normal',
	block: true,
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
				:size="componentProps.size"
				:variant="componentProps.variant"
				:block="componentProps.block"
				:indicator="componentProps.indicator"
			/>
		</template>
	</PlaygroundLayout>
</template>

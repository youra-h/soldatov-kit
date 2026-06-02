<script setup lang="ts">
import { ref } from 'vue'
import PlaygroundLayout from './../layouts/PlaygroundLayout.vue'
import Properties from './../common/Properties.vue'
import type { TPropertiesSchema } from './../common/Properties.vue'
import SlotsDemo from './../components/drag-and-drop/Slots.vue'
import { SIZES, VARIANTS } from '../common/items'
import type { TComponentSize, TComponentVariant, TTabsOrientation } from '@core'

const ORIENTATIONS: TTabsOrientation[] = ['horizontal', 'vertical']

const propertiesSchema: TPropertiesSchema = {
	orientation: { type: 'select', default: 'horizontal', options: ORIENTATIONS },
	size: { type: 'select', default: 'normal', options: SIZES },
	variant: { type: 'select', default: 'normal', options: VARIANTS },
}

const componentProps = ref<{
	orientation: TTabsOrientation
	size: TComponentSize
	variant: TComponentVariant
}>({
	orientation: 'horizontal',
	size: 'normal',
	variant: 'normal',
})
</script>

<template>
	<PlaygroundLayout title="DragAndDrop Playground">
		<template #properties>
			<Properties v-model="componentProps" :schema="propertiesSchema" />
		</template>

		<template #slots-demo>
			<SlotsDemo
				:orientation="componentProps.orientation"
				:size="componentProps.size"
				:variant="componentProps.variant"
			/>
		</template>
	</PlaygroundLayout>
</template>

<style lang="scss" scoped>
@reference "./../../../foundation/tailwind/index.css";

.drag-playground {
	&__stub {
		@apply text-sm text-gray-400;
	}
}
</style>

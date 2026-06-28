<script setup lang="ts">
import { ref } from 'vue'
import PlaygroundLayout from './../layouts/PlaygroundLayout.vue'
import type { EventLogEntry } from '../common/EventLog.vue'
import Properties from './../common/Properties.vue'
import type { TPropertiesSchema } from './../common/Properties.vue'
import PropsDemo from './../components/skeleton/Component.vue'
import InstanceDemo from './../components/skeleton/Instance.vue'
import SlotsDemo from './../components/skeleton/Slots.vue'
import { SIZES, VARIANTS } from '../common/items'
import type { TComponentSize, TComponentVariant, TSkeletonShape, TSkeletonAnimation } from '@core'

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

const SHAPES: TSkeletonShape[] = ['rect', 'rounded', 'circle']
const ANIMATIONS: TSkeletonAnimation[] = ['pulse', 'wave', 'none']

const propertiesSchema: TPropertiesSchema = {
	visible: { type: 'boolean', default: true },
	rendered: { type: 'boolean', default: true },
	size: { type: 'select', default: 'normal', options: SIZES },
	variant: { type: 'select', default: 'normal', options: VARIANTS },
	shape: { type: 'select', default: 'rect', options: SHAPES },
	animation: { type: 'select', default: 'pulse', options: ANIMATIONS },
}

const componentProps = ref<{
	visible: boolean
	rendered: boolean
	size: TComponentSize
	variant: TComponentVariant
	shape: TSkeletonShape
	animation: TSkeletonAnimation
}>({
	visible: true,
	rendered: true,
	size: 'normal',
	variant: 'normal',
	shape: 'rect',
	animation: 'pulse',
})

const instanceDemoRef = ref<InstanceType<typeof InstanceDemo>>()

const handleShow = () => {
	instanceDemoRef.value?.show()
}

const handleHide = () => {
	instanceDemoRef.value?.hide()
}
</script>

<template>
	<PlaygroundLayout title="Skeleton Playground">
		<template #properties>
			<Properties
				v-model="componentProps"
				:schema="propertiesSchema"
				@show="handleShow"
				@hide="handleHide"
			/>
		</template>

		<template #props-demo>
			<PropsDemo v-bind="componentProps" @log="emit('log', $event)" />
		</template>

		<template #instance-demo>
			<InstanceDemo
				ref="instanceDemoRef"
				v-bind="componentProps"
				@log="emit('log', $event)"
			/>
		</template>

		<template #slots-demo>
			<SlotsDemo v-bind="componentProps" />
		</template>
	</PlaygroundLayout>
</template>

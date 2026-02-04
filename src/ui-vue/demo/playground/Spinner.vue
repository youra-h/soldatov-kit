<script setup lang="ts">
import { ref } from 'vue'
import PlaygroundLayout from './../layout/PlaygroundLayout.vue'
import type { EventLogEntry } from '../common/EventLog.vue'
import Properties from './../common/Properties.vue'
import type { TPropertiesSchema } from './../common/Properties.vue'
import PropsDemo from './../components/spinner/Component.vue'
import InstanceDemo from './../components/spinner/Instance.vue'
import SlotsDemo from './../components/spinner/Slots.vue'
import { SIZES, VARIANTS } from '../common/items'
import type { TComponentSize, TComponentVariant } from '@core'

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

// Схема свойств для Spinner
const propertiesSchema: TPropertiesSchema = {
	visible: { type: 'boolean', default: true },
	rendered: { type: 'boolean', default: true },
	size: { type: 'select', default: 'normal', options: SIZES },
	variant: { type: 'select', default: 'normal', options: VARIANTS },
}

// Component properties state
const componentProps = ref<{
	visible: boolean
	rendered: boolean
	size: TComponentSize
	variant: TComponentVariant
}>({
	visible: true,
	rendered: true,
	size: 'normal',
	variant: 'normal',
})

// Ref для Instance demo
const instanceDemoRef = ref<InstanceType<typeof InstanceDemo>>()

const handleShow = () => {
	instanceDemoRef.value?.show()
}

const handleHide = () => {
	instanceDemoRef.value?.hide()
}
</script>

<template>
	<PlaygroundLayout title="Spinner Playground">
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

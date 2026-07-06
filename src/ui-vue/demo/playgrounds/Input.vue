<script setup lang="ts">
import { ref } from 'vue'
import PlaygroundLayout from './../layouts/PlaygroundLayout.vue'
import type { EventLogEntry } from '../common/EventLog.vue'
import Properties from './../common/Properties.vue'
import type { TPropertiesSchema } from './../common/Properties.vue'
import PropsDemo from './../components/input/Component.vue'
import InstanceDemo from './../components/input/Instance.vue'
import SlotsDemo from './../components/input/Slots.vue'
import { SIZES, VARIANTS } from '../common/items'
import type { TComponentSize, TComponentVariant } from '@core'

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

const propertiesSchema: TPropertiesSchema = {
	visible: { type: 'boolean', default: true },
	rendered: { type: 'boolean', default: true },
	disabled: { type: 'boolean', default: false },
	readonly: { type: 'boolean', default: false },
	required: { type: 'boolean', default: false },
	size: { type: 'select', default: 'normal', options: SIZES },
	variant: { type: 'select', default: 'normal', options: VARIANTS },
	value: { type: 'string', default: '' },
	placeholder: { type: 'string', default: 'Enter text...' },
}

const componentProps = ref<{
	visible: boolean
	rendered: boolean
	disabled: boolean
	readonly: boolean
	required: boolean
	size: TComponentSize
	variant: TComponentVariant
	value: string
	placeholder: string
}>({
	visible: true,
	rendered: true,
	disabled: false,
	readonly: false,
	required: false,
	size: 'normal',
	variant: 'normal',
	value: '',
	placeholder: 'Enter text...',
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
	<PlaygroundLayout title="Input Playground">
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
			<SlotsDemo :visible="componentProps.visible" :rendered="componentProps.rendered" />
		</template>
	</PlaygroundLayout>
</template>

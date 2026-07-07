<script setup lang="ts">
import { ref } from 'vue'
import PlaygroundLayout from './../layouts/PlaygroundLayout.vue'
import type { EventLogEntry } from '../common/EventLog.vue'
import Properties from './../common/Properties.vue'
import type { TPropertiesSchema } from './../common/Properties.vue'
import PropsDemo from './../components/frame/Component.vue'
import InstanceDemo from './../components/frame/Instance.vue'
import SlotsDemo from './../components/frame/Slots.vue'

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

// Схема свойств для Frame
const propertiesSchema: TPropertiesSchema = {
	visible: { type: 'boolean', default: false },
	x: { type: 'number', default: 50 },
	y: { type: 'number', default: 50 },
	width: { type: 'number', default: 300 },
	height: { type: 'number', default: 200 },
}

// Component properties state
const componentProps = ref<{
	visible: boolean
	x: number
	y: number
	width: number | string
	height: number | string
}>({
	visible: false,
	x: 50,
	y: 50,
	width: 300,
	height: 200,
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
	<PlaygroundLayout title="Frame Playground">
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

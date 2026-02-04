<script setup lang="ts">
import { ref } from 'vue'
import PlaygroundLayout from './PlaygroundLayout.vue'
import type { EventLogEntry } from './EventLog.vue'
import Properties from './common/Properties.vue'
import type { TPropertiesSchema } from './common/Properties.vue'
import PropsDemo from './component-view/Component.vue'
import InstanceDemo from './component-view/Instance.vue'
import SlotsDemo from './component-view/Slots.vue'
import { HTML_TAGS } from './common/items'

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

// Схема свойств для ComponentView
const propertiesSchema: TPropertiesSchema = {
	visible: { type: 'boolean', default: true },
	rendered: { type: 'boolean', default: true },
	tag: { type: 'select', default: 'div', options: HTML_TAGS },
}

// Component properties state
const componentProps = ref({
	visible: true,
	rendered: true,
	tag: 'div',
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
	<PlaygroundLayout title="ComponentView Playground">
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

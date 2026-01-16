<script setup lang="ts">
import { ref } from 'vue'
import PlaygroundLayout from './PlaygroundLayout.vue'
import EventLog from './EventLog.vue'
import type { EventLogEntry } from './EventLog.vue'
import PropertiesPanel from './component-view/PropertiesPanel.vue'
import PropsDemo from './component-view/PropsDemo.vue'
import InstanceDemo from './component-view/InstanceDemo.vue'
import SlotsDemo from './component-view/SlotsDemo.vue'

// Component properties state
const componentProps = ref({
	visible: true,
	rendered: true,
	tag: 'div'
})

// Event log
const eventLog = ref<EventLogEntry[]>([])

const handlePropsChange = (newProps: Partial<typeof componentProps.value>) => {
	componentProps.value = { ...componentProps.value, ...newProps }
}

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
</script>

<template>
	<PlaygroundLayout title="ComponentView Playground">
		<template #properties>
			<PropertiesPanel
				v-bind="componentProps"
				@change="handlePropsChange"
			/>
		</template>

		<template #props-demo>
			<PropsDemo
				v-bind="componentProps"
				@log="handleLog"
			/>
		</template>

		<template #instance-demo>
			<InstanceDemo
				v-bind="componentProps"
				@log="handleLog"
			/>
		</template>

		<template #slots-demo>
			<SlotsDemo
				v-bind="componentProps"
			/>
		</template>

		<template #event-log>
			<EventLog :events="eventLog" @clear="handleClearLogs" />
		</template>
	</PlaygroundLayout>
</template>

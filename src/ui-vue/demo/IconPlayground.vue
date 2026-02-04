<script setup lang="ts">
import { ref } from 'vue'
import PlaygroundLayout from './layout/PlaygroundLayout.vue'
import type { EventLogEntry } from './EventLog.vue'
import Properties from './common/Properties.vue'
import type { TPropertiesSchema } from './common/Properties.vue'
import PropsDemo from './icon/Component.vue'
import InstanceDemo from './icon/Instance.vue'
import SlotsDemo from './icon/Slots.vue'
import { SIZES, ICON_PATHS } from './common/items'
import type { TComponentSize } from '@core'

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

// Схема свойств для Icon
const propertiesSchema: TPropertiesSchema = {
	visible: { type: 'boolean', default: true },
	rendered: { type: 'boolean', default: true },
	tag: { type: 'select', default: '/src/icons/home.svg', options: ICON_PATHS },
	size: { type: 'select', default: 'normal', options: SIZES },
	width: { type: 'string', placeholder: 'auto' },
	height: { type: 'string', placeholder: 'auto' },
}

// Component properties state
const componentProps = ref<{
	visible: boolean
	rendered: boolean
	tag: string
	size: TComponentSize
	width?: number | string
	height?: number | string
}>({
	visible: true,
	rendered: true,
	tag: '/src/icons/home.svg',
	size: 'normal',
	width: undefined,
	height: undefined,
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
	<PlaygroundLayout title="Icon Playground">
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

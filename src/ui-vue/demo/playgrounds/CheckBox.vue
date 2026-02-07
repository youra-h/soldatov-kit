<script setup lang="ts">
import { ref } from 'vue'
import PlaygroundLayout from './../layouts/PlaygroundLayout.vue'
import type { EventLogEntry } from '../common/EventLog.vue'
import Properties from './../common/Properties.vue'
import type { TPropertiesSchema } from './../common/Properties.vue'
import PropsDemo from './../components/check-box/Component.vue'
import InstanceDemo from './../components/check-box/Instance.vue'
import SlotsDemo from './../components/check-box/Slots.vue'
import { SIZES, VARIANTS, ICON_PATHS } from '../common/items'
import type { TComponentSize, TComponentVariant, TInputControlState } from '@core'

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

const INPUT_STATES: TInputControlState[] = ['normal', 'success', 'warning', 'error']

// Схема свойств для CheckBox
const propertiesSchema: TPropertiesSchema = {
	visible: { type: 'boolean', default: true },
	rendered: { type: 'boolean', default: true },
	disabled: { type: 'boolean', default: false },
	readonly: { type: 'boolean', default: false },
	required: { type: 'boolean', default: false },
	invalid: { type: 'boolean', default: false },
	size: { type: 'select', default: 'normal', options: SIZES },
	variant: { type: 'select', default: 'normal', options: VARIANTS },
	state: { type: 'select', default: 'normal', options: INPUT_STATES },
	value: { type: 'boolean', default: false },
	indeterminate: { type: 'boolean', default: false },
	plain: { type: 'boolean', default: false },
	icon: { type: 'select', default: '', options: ['', ...ICON_PATHS] },
	indeterminateIcon: { type: 'select', default: '', options: ['', ...ICON_PATHS] },
}

// Component properties state
const componentProps = ref<{
	visible: boolean
	rendered: boolean
	disabled: boolean
	readonly: boolean
	required: boolean
	invalid: boolean
	size: TComponentSize
	variant: TComponentVariant
	state: TInputControlState
	value: boolean
	indeterminate: boolean
	plain: boolean
	icon: string
	indeterminateIcon: string
}>({
	visible: true,
	rendered: true,
	disabled: false,
	readonly: false,
	required: false,
	invalid: false,
	size: 'normal',
	variant: 'normal',
	state: 'normal',
	value: false,
	indeterminate: false,
	plain: false,
	icon: '',
	indeterminateIcon: '',
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
	<PlaygroundLayout title="CheckBox Playground">
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

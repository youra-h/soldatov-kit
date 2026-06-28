<script setup lang="ts">
import { ref, computed } from 'vue'
import PlaygroundLayout from './../layouts/PlaygroundLayout.vue'
import type { EventLogEntry } from '../common/EventLog.vue'
import Properties from './../common/Properties.vue'
import type { TPropertiesSchema } from './../common/Properties.vue'
import PropsDemo from './../components/button/Component.vue'
import InstanceDemo from './../components/button/Instance.vue'
import SlotsDemo from './../components/button/Slots.vue'
import { SIZES, VARIANTS, BUTTON_APPEARANCES } from '../common/items'
import type { TComponentSize, TComponentVariant, TButtonView } from '@core'

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

// Схема свойств для Button
const propertiesSchema: TPropertiesSchema = {
	visible: { type: 'boolean', default: true },
	rendered: { type: 'boolean', default: true },
	disabled: { type: 'boolean', default: false },
	size: { type: 'select', default: 'normal', options: SIZES },
	variant: { type: 'select', default: 'normal', options: VARIANTS },
	view: { type: 'select', default: 'filled', options: BUTTON_APPEARANCES },
	text: { type: 'string', default: 'Button', placeholder: 'Button text' },
}

// Component properties state
const componentProps = ref<{
	visible: boolean
	rendered: boolean
	disabled: boolean
	size: TComponentSize
	variant: TComponentVariant
	view: TButtonView
	text: string
}>({
	visible: true,
	rendered: true,
	disabled: false,
	size: 'normal',
	variant: 'normal',
	view: 'filled',
	text: 'Button',
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
	<PlaygroundLayout title="Button Playground">
		<template #properties>
			<div class="button-properties">
				<Properties
					v-model="componentProps"
					:schema="propertiesSchema"
					@show="handleShow"
					@hide="handleHide"
				/>
			</div>
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
			<SlotsDemo :size="componentProps.size" :variant="componentProps.variant" :disabled="componentProps.disabled"/>
		</template>
	</PlaygroundLayout>
</template>

<style lang="scss" scoped>
@reference "./../../../foundation/tailwind/index.css";

.button-properties {
	@apply flex flex-col;
	@apply gap-4;
}
</style>

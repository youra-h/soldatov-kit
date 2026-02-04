<script setup lang="ts">
import { ref, computed } from 'vue'
import PlaygroundLayout from './PlaygroundLayout.vue'
import type { EventLogEntry } from './EventLog.vue'
import Properties from './common/Properties.vue'
import type { TPropertiesSchema } from './common/Properties.vue'
import LoadingControl from './common/LoadingControl.vue'
import PropsDemo from './button/Component.vue'
import InstanceDemo from './button/Instance.vue'
import SlotsDemo from './button/Slots.vue'
import { SIZES, VARIANTS, BUTTON_APPEARANCES } from './common/items'
import type { TComponentSize, TComponentVariant, TButtonAppearance } from '@core'

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

type SpinnerType = 'none' | 'default' | 'small' | 'large' | 'primary' | 'danger'

// Схема свойств для Button
const propertiesSchema: TPropertiesSchema = {
	visible: { type: 'boolean', default: true },
	rendered: { type: 'boolean', default: true },
	disabled: { type: 'boolean', default: false },
	size: { type: 'select', default: 'normal', options: SIZES },
	variant: { type: 'select', default: 'normal', options: VARIANTS },
	appearance: { type: 'select', default: 'normal', options: BUTTON_APPEARANCES },
	text: { type: 'string', default: 'Button', placeholder: 'Button text' },
}

// Component properties state
const componentProps = ref<{
	visible: boolean
	rendered: boolean
	disabled: boolean
	size: TComponentSize
	variant: TComponentVariant
	appearance: TButtonAppearance
	text: string
	// Loading state
	loading: boolean
	loadingDisabled: boolean
	spinnerType: SpinnerType
}>({
	visible: true,
	rendered: true,
	disabled: false,
	size: 'normal',
	variant: 'normal',
	appearance: 'normal',
	text: 'Button',
	loading: false,
	loadingDisabled: true,
	spinnerType: 'default',
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

				<div class="button-properties__divider"></div>

				<LoadingControl
					v-model:loading="componentProps.loading"
					v-model:disabled="componentProps.loadingDisabled"
					v-model:spinner-type="componentProps.spinnerType"
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
			<SlotsDemo :size="componentProps.size" :variant="componentProps.variant" />
		</template>
	</PlaygroundLayout>
</template>

<style lang="scss" scoped>
@reference "./../../foundation/tailwind/index.css";

.button-properties {
	@apply flex flex-col;
	@apply gap-4;

	&__divider {
		@apply border-t border-gray-200;
	}
}
</style>

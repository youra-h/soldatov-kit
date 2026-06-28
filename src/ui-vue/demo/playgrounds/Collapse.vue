<script setup lang="ts">
import { ref } from 'vue'
import PlaygroundLayout from './../layouts/PlaygroundLayout.vue'
import type { EventLogEntry } from '../common/EventLog.vue'
import Properties from './../common/Properties.vue'
import type { TPropertiesSchema } from './../common/Properties.vue'
import PropsDemo from './../components/collapse/Component.vue'
import InstanceDemo from './../components/collapse/Instance.vue'
import SlotsDemo from './../components/collapse/Slots.vue'
import { SIZES, VARIANTS } from '../common/items.ts'
import type {
	TComponentSize,
	TComponentVariant,
	TCollapseView,
	TSelectionMode,
	TCollapseArrowPlacement,
} from '@core'

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

const COLLAPSE_APPEARANCES: TCollapseView[] = ['plain', 'outlined', 'filled']
const COLLAPSE_MODES: TSelectionMode[] = ['single', 'multiple', 'none']
const ARROW_PLACEMENTS: TCollapseArrowPlacement[] = ['start', 'end']

const collapseSchema: TPropertiesSchema = {
	visible: { type: 'boolean', default: true },
	rendered: { type: 'boolean', default: true },
	disabled: { type: 'boolean', default: false },
	size: { type: 'select', default: 'normal', options: SIZES },
	variant: { type: 'select', default: 'normal', options: VARIANTS },
	view: { type: 'select', default: 'plain', options: COLLAPSE_APPEARANCES },
	mode: { type: 'select', default: 'multiple', options: COLLAPSE_MODES },
	arrowPlacement: { type: 'select', default: 'start', options: ARROW_PLACEMENTS },
}

const itemSchema: TPropertiesSchema = {
	itemApplyTarget: {
		type: 'select',
		default: 'first',
		options: [
			{ value: 'first', label: 'First item only' },
			{ value: 'all', label: 'All items' },
		],
	},
	itemDisabled: { type: 'boolean', default: false },
}

const componentProps = ref<{
	visible: boolean
	rendered: boolean
	disabled: boolean
	size: TComponentSize
	variant: TComponentVariant
	view: TCollapseView
	mode: TSelectionMode
	arrowPlacement: TCollapseArrowPlacement
	itemApplyTarget: 'all' | 'first'
	itemDisabled: boolean
}>({
	visible: true,
	rendered: true,
	disabled: false,
	size: 'normal',
	variant: 'normal',
	view: 'plain',
	mode: 'multiple',
	arrowPlacement: 'start',
	itemApplyTarget: 'first',
	itemDisabled: false,
})

const instanceDemoRef = ref<InstanceType<typeof InstanceDemo>>()

const handleShow = () => instanceDemoRef.value?.show()
const handleHide = () => instanceDemoRef.value?.hide()
</script>

<template>
	<PlaygroundLayout title="Collapse Playground">
		<template #properties>
			<div class="collapse-properties">
				<div class="collapse-properties__section">
					<h3 class="collapse-properties__section-title">Collapse</h3>
					<Properties
						v-model="componentProps"
						:schema="collapseSchema"
						@show="handleShow"
						@hide="handleHide"
					/>
				</div>

				<div class="collapse-properties__divider" />

				<div class="collapse-properties__section">
					<h3 class="collapse-properties__section-title">Collapse Item</h3>
					<Properties v-model="componentProps" :schema="itemSchema" />
				</div>
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
@reference "./../../../foundation/tailwind/index.css";

.collapse-properties {
	@apply flex flex-col gap-4;

	&__section {
		@apply flex flex-col gap-3;
	}

	&__section-title {
		@apply text-sm font-semibold text-gray-500 uppercase tracking-wide;
	}

	&__divider {
		@apply border-t border-gray-200;
	}
}
</style>

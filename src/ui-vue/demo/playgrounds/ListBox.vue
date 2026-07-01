<script setup lang="ts">
import { ref } from 'vue'
import PlaygroundLayout from './../layouts/PlaygroundLayout.vue'
import type { EventLogEntry } from '../common/EventLog.vue'
import Properties from './../common/Properties.vue'
import type { TPropertiesSchema } from './../common/Properties.vue'
import PropsDemo from './../components/list-box/Component.vue'
import InstanceDemo from './../components/list-box/Instance.vue'
import SlotsDemo from './../components/list-box/Slots.vue'
import { SIZES, VARIANTS } from '../common/items.ts'
import type { TComponentSize, TComponentVariant, TListBoxView, TSelectionMode } from '@core'

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

const LIST_BOX_APPEARANCES: TListBoxView[] = ['plain', 'outlined', 'filled']
const LIST_BOX_MODES: TSelectionMode[] = ['single', 'multiple', 'none']

const listBoxSchema: TPropertiesSchema = {
	visible: { type: 'boolean', default: true },
	rendered: { type: 'boolean', default: true },
	disabled: { type: 'boolean', default: false },
	size: { type: 'select', default: 'normal', options: SIZES },
	variant: { type: 'select', default: 'normal', options: VARIANTS },
	view: { type: 'select', default: 'plain', options: LIST_BOX_APPEARANCES },
	mode: { type: 'select', default: 'single', options: LIST_BOX_MODES },
	autoWidth: { type: 'boolean', default: false },
	wordWrap: { type: 'boolean', default: false },
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
	itemWordWrap: { type: 'boolean', default: false },
}

const componentProps = ref<{
	visible: boolean
	rendered: boolean
	disabled: boolean
	size: TComponentSize
	variant: TComponentVariant
	view: TListBoxView
	mode: TSelectionMode
	autoWidth: boolean
	wordWrap: boolean
	itemApplyTarget: 'all' | 'first'
	itemDisabled: boolean
	itemWordWrap: boolean
}>({
	visible: true,
	rendered: true,
	disabled: false,
	size: 'normal',
	variant: 'normal',
	view: 'plain',
	mode: 'single',
	autoWidth: false,
	wordWrap: false,
	itemApplyTarget: 'first',
	itemDisabled: false,
	itemWordWrap: false,
})

const instanceDemoRef = ref<InstanceType<typeof InstanceDemo>>()

const handleShow = () => instanceDemoRef.value?.show()
const handleHide = () => instanceDemoRef.value?.hide()
</script>

<template>
	<PlaygroundLayout title="ListBox Playground">
		<template #properties>
			<div class="list-box-properties">
				<div class="list-box-properties__section">
					<h3 class="list-box-properties__section-title">ListBox</h3>
					<Properties
						v-model="componentProps"
						:schema="listBoxSchema"
						@show="handleShow"
						@hide="handleHide"
					/>
				</div>

				<div class="list-box-properties__divider" />

				<div class="list-box-properties__section">
					<h3 class="list-box-properties__section-title">ListBox Item</h3>
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

.list-box-properties {
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

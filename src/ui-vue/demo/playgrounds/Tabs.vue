<script setup lang="ts">
import { ref } from 'vue'
import PlaygroundLayout from './../layouts/PlaygroundLayout.vue'
import type { EventLogEntry } from '../common/EventLog.vue'
import Properties from './../common/Properties.vue'
import type { TPropertiesSchema } from './../common/Properties.vue'
import PropsDemo from './../components/tabs/Component.vue'
import InstanceDemo from './../components/tabs/Instance.vue'
import SlotsDemo from './../components/tabs/Slots.vue'
import { SIZES, VARIANTS } from '../common/items.ts'
import type {
	TComponentSize,
	TComponentVariant,
	TTabsOrientation,
	TTabsAlignment,
	TTabsPosition,
	TTabsView,
} from '@core'

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

const TABS_APPEARANCES: TTabsView[] = ['line', 'contained', 'outline']
const TABS_ORIENTATIONS: TTabsOrientation[] = ['horizontal', 'vertical']
const TABS_ALIGNMENTS: TTabsAlignment[] = ['start', 'center', 'end', 'stretch']
const TABS_POSITIONS: TTabsPosition[] = ['start', 'end']

const tabsSchema: TPropertiesSchema = {
	visible: { type: 'boolean', default: true },
	rendered: { type: 'boolean', default: true },
	disabled: { type: 'boolean', default: false },
	size: { type: 'select', default: 'normal', options: SIZES },
	variant: { type: 'select', default: 'normal', options: VARIANTS },
	view: { type: 'select', default: 'line', options: TABS_APPEARANCES },
	orientation: { type: 'select', default: 'horizontal', options: TABS_ORIENTATIONS },
	alignment: { type: 'select', default: 'start', options: TABS_ALIGNMENTS },
	position: { type: 'select', default: 'start', options: TABS_POSITIONS },
	closable: { type: 'boolean', default: false },
}

const tabItemSchema: TPropertiesSchema = {
	tabApplyTarget: {
		type: 'select',
		default: 'first',
		options: [
			{ value: 'first', label: 'First tab only' },
			{ value: 'all', label: 'All tabs' },
		],
	},
	tabDisabled: { type: 'boolean', default: false },
	tabClosable: { type: 'boolean', default: false },
}

const componentProps = ref<{
	visible: boolean
	rendered: boolean
	disabled: boolean
	size: TComponentSize
	variant: TComponentVariant
	view: TTabsView
	orientation: TTabsOrientation
	alignment: TTabsAlignment
	position: TTabsPosition
	closable: boolean
	tabApplyTarget: 'all' | 'first'
	tabDisabled: boolean
	tabClosable: boolean
}>({
	visible: true,
	rendered: true,
	disabled: false,
	size: 'normal',
	variant: 'normal',
	view: 'line',
	orientation: 'horizontal',
	alignment: 'start',
	position: 'start',
	closable: false,
	tabApplyTarget: 'first',
	tabDisabled: false,
	tabClosable: false,
})

const instanceDemoRef = ref<InstanceType<typeof InstanceDemo>>()

const handleShow = () => instanceDemoRef.value?.show()
const handleHide = () => instanceDemoRef.value?.hide()
</script>

<template>
	<PlaygroundLayout title="Tabs Playground">
		<template #properties>
			<div class="tabs-properties">
				<div class="tabs-properties__section">
					<h3 class="tabs-properties__section-title">TTabs</h3>
					<Properties
						v-model="componentProps"
						:schema="tabsSchema"
						@show="handleShow"
						@hide="handleHide"
					/>
				</div>

				<div class="tabs-properties__divider" />

				<div class="tabs-properties__section">
					<h3 class="tabs-properties__section-title">Tab Item</h3>
					<Properties v-model="componentProps" :schema="tabItemSchema" />
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

.tabs-properties {
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

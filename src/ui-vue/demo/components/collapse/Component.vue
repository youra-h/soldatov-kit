<script setup lang="ts">
import { computed } from 'vue'
import { Collapse, CollapseItem, emitsCollapse } from '@ui/collapse'
import PanelDemo from '../../common/PanelDemo.vue'
import { useEventLogger } from '../../common/useEventLogger'
import type { EventLogEntry } from '../../common/EventLog.vue'
import type {
	TComponentSize,
	TComponentVariant,
	TCollapseView,
	TSelectionMode,
	TCollapseArrowPlacement,
} from '@core'

type Props = {
	visible?: boolean
	rendered?: boolean
	disabled?: boolean
	size?: TComponentSize
	variant?: TComponentVariant
	view?: TCollapseView
	mode?: TSelectionMode
	arrowPlacement?: TCollapseArrowPlacement
	// Item props
	itemDisabled?: boolean
	itemApplyTarget?: 'all' | 'first'
}

const props = withDefaults(defineProps<Props>(), {
	itemApplyTarget: 'first',
})

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

const { handlers } = useEventLogger(emit, emitsCollapse)

const applyAll = computed(() => props.itemApplyTarget === 'all')
</script>

<template>
	<PanelDemo info="Props-based demo">
		<Collapse
			:visible="visible"
			:rendered="rendered"
			:disabled="disabled"
			:size="size"
			:variant="variant"
			:view="view"
			:mode="mode"
			v-bind="handlers"
		>
			<CollapseItem
				text="Section 1"
				value="sec1"
				:disabled="itemDisabled"
				:arrowPlacement="arrowPlacement"
				:selected="true"
			>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
				incididunt ut labore et dolore magna aliqua.
			</CollapseItem>
			<CollapseItem
				text="Section 2"
				value="sec2"
				:disabled="applyAll ? itemDisabled : false"
				:arrowPlacement="arrowPlacement"
			>
				lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
				incididunt ut labore et dolore magna aliqua.
			</CollapseItem>
			<CollapseItem
				text="Section 3"
				value="sec3"
				:disabled="applyAll ? itemDisabled : false"
				:arrowPlacement="arrowPlacement"
			>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
				incididunt ut labore et dolore magna aliqua.
				lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
				incididunt ut labore et dolore magna aliqua.
			</CollapseItem>
		</Collapse>
	</PanelDemo>
</template>

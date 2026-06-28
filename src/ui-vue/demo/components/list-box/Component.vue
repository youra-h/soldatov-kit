<script setup lang="ts">
import { computed } from 'vue'
import { ListBox, ListBoxItem, emitsListBox } from '@ui/list-box'
import PanelDemo from '../../common/PanelDemo.vue'
import { useEventLogger } from '../../common/useEventLogger'
import type { EventLogEntry } from '../../common/EventLog.vue'
import type {
	TComponentSize,
	TComponentVariant,
	TListBoxView,
	TSelectionMode,
} from '@core'

type Props = {
	visible?: boolean
	rendered?: boolean
	disabled?: boolean
	size?: TComponentSize
	variant?: TComponentVariant
	view?: TListBoxView
	mode?: TSelectionMode
	maxRows?: number
	autoWidth?: boolean
	wordWrap?: boolean
	// Item props
	itemDisabled?: boolean
	itemWordWrap?: boolean
	itemApplyTarget?: 'all' | 'first'
}

const props = withDefaults(defineProps<Props>(), {
	itemApplyTarget: 'first',
})

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

const { handlers } = useEventLogger(emit, emitsListBox)

const applyAll = computed(() => props.itemApplyTarget === 'all')
</script>

<template>
	<PanelDemo info="Props-based demo">
		<ListBox
			:visible="visible"
			:rendered="rendered"
			:disabled="disabled"
			:size="size"
			:variant="variant"
			:view="view"
			:mode="mode"
			:max-rows="maxRows"
			:auto-width="autoWidth"
			:word-wrap="wordWrap"
			v-bind="handlers"
		>
			<ListBoxItem
				text="Item 1 Item 1Item 1Item 1Item 1Item 1Item 1Item Item 1 Item 1 Item 1"
				value="item1"
				:disabled="itemDisabled"
				:word-wrap="itemWordWrap"
				:selected="true"
			/>
			<ListBoxItem
				text="Item 2"
				value="item2"
				:disabled="applyAll ? itemDisabled : false"
				:word-wrap="applyAll ? itemWordWrap : undefined"
			/>
			<ListBoxItem
				text="Item 3"
				value="item3"
				:disabled="applyAll ? itemDisabled : false"
				:word-wrap="applyAll ? itemWordWrap : undefined"
			/>
		</ListBox>
	</PanelDemo>
</template>

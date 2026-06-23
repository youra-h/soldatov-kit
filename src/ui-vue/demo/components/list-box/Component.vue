<script setup lang="ts">
import { computed } from 'vue'
import { ListBox, ListBoxItem, emitsListBox } from '@ui/list-box'
import PanelDemo from '../../common/PanelDemo.vue'
import { useEventLogger } from '../../common/useEventLogger'
import type { EventLogEntry } from '../../common/EventLog.vue'
import type {
	TComponentSize,
	TComponentVariant,
	TListBoxAppearance,
	TSelectionMode,
} from '@core'

type Props = {
	visible?: boolean
	rendered?: boolean
	disabled?: boolean
	size?: TComponentSize
	variant?: TComponentVariant
	appearance?: TListBoxAppearance
	mode?: TSelectionMode
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
			:appearance="appearance"
			:mode="mode"
			v-bind="handlers"
		>
			<ListBoxItem
				text="Item 1 Item 1Item 1Item 1Item 1Item 1Item 1Item"
				value="item1"
				:disabled="itemDisabled"
				:selected="true"
			/>
			<ListBoxItem
				text="Item 2"
				value="item2"
				:disabled="applyAll ? itemDisabled : false"
			/>
			<ListBoxItem
				text="Item 3"
				value="item3"
				:disabled="applyAll ? itemDisabled : false"
			/>
		</ListBox>
	</PanelDemo>
</template>

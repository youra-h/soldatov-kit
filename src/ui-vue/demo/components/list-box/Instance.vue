<script setup lang="ts">
import { watch } from 'vue'
import { ListBox, emitsListBox } from '@ui/list-box'
import { TListBox } from '@core'
import PanelDemo from '../../common/PanelDemo.vue'
import { useSyncPropsToInstance } from '../../common/useSyncPropsToInstance'
import { useEventLogger, useCoreEventLogger } from '../../common/useEventLogger'
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
	wordWrap?: boolean
	itemDisabled?: boolean
	itemWordWrap?: boolean
	itemApplyTarget?: 'all' | 'first'
}

const props = defineProps<Props>()

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

defineExpose({
	show: () => instance.show(),
	hide: () => instance.hide(),
})

const instance = new TListBox({
	visible: props.visible ?? true,
	rendered: props.rendered ?? true,
	disabled: props.disabled ?? false,
	size: props.size ?? 'normal',
	variant: props.variant ?? 'normal',
	appearance: props.appearance ?? 'plain',
	mode: props.mode ?? 'single',
	wordWrap: props.wordWrap ?? false,
})

instance.collection.add({ text: 'Item 1', value: 'item1', selected: true })
instance.collection.add({ text: 'Item 2', value: 'item2' })
instance.collection.add({ text: 'Item 3', value: 'item3' })

const { handlers, logEvent } = useEventLogger(emit, emitsListBox)
useCoreEventLogger(instance, logEvent, emitsListBox)

useSyncPropsToInstance(props, instance, [
	'visible',
	'rendered',
	'disabled',
	'size',
	'variant',
	'appearance',
	'mode',
	'wordWrap',
])

watch(
	[() => props.itemDisabled, () => props.itemWordWrap, () => props.itemApplyTarget],
	() => {
		instance.collection.items.forEach((item, index) => {
			const apply = props.itemApplyTarget === 'all' || index === 0
			item.disabled = apply ? !!props.itemDisabled : false
			item.wordWrap = apply ? props.itemWordWrap : undefined
		})
	},
	{ immediate: true },
)
</script>

<template>
	<PanelDemo info="Instance-based demo">
		<ListBox :ctrl="instance" v-bind="handlers" />
	</PanelDemo>
</template>

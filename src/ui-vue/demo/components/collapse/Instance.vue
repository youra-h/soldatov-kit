<script setup lang="ts">
import { watch } from 'vue'
import { Collapse, emitsCollapse } from '@ui/collapse'
import { TCollapse } from '@core'
import PanelDemo from '../../common/PanelDemo.vue'
import { useSyncPropsToInstance } from '../../common/useSyncPropsToInstance'
import { useEventLogger, useCoreEventLogger } from '../../common/useEventLogger'
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
	itemDisabled?: boolean
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

const instance = new TCollapse({
	visible: props.visible ?? true,
	rendered: props.rendered ?? true,
	disabled: props.disabled ?? false,
	size: props.size ?? 'normal',
	variant: props.variant ?? 'normal',
	view: props.view ?? 'plain',
	mode: props.mode ?? 'multiple',
})

const item1 = instance.collection.add({ text: 'Section 1', value: 'sec1' })
item1.selected = true
instance.collection.add({ text: 'Section 2', value: 'sec2' })
instance.collection.add({ text: 'Section 3', value: 'sec3' })

const { handlers, logEvent } = useEventLogger(emit, emitsCollapse)
useCoreEventLogger(instance, logEvent, emitsCollapse)

useSyncPropsToInstance(props, instance, [
	'visible',
	'rendered',
	'disabled',
	'size',
	'variant',
	'view',
	'mode',
])

// Синхронизация свойств элементов
watch(
	[() => props.itemDisabled, () => props.itemApplyTarget, () => props.arrowPlacement],
	() => {
		instance.collection.items.forEach((item, index) => {
			const apply = props.itemApplyTarget === 'all' || index === 0
			item.disabled = apply ? !!props.itemDisabled : false
			if (props.arrowPlacement !== undefined) {
				item.arrowPlacement = props.arrowPlacement
			}
		})
	},
	{ immediate: true },
)
</script>

<template>
	<PanelDemo info="Instance-based demo">
		<Collapse :ctrl="instance" v-bind="handlers">
			<template #panel:sec1>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
				incididunt ut labore et dolore magna aliqua.
			</template>
			<template #panel:sec2>
				lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
				incididunt ut labore et dolore magna aliqua.
			</template>
			<template #panel:sec3>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
				incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur
				adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
			</template>
		</Collapse>
	</PanelDemo>
</template>

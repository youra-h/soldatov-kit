<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Tabs, emitsTabs } from '@ui/tabs'
import { TTabs } from '@core'
import PanelDemo from '../../common/PanelDemo.vue'
import { useSyncPropsToInstance } from '../../common/useSyncPropsToInstance'
import { useEventLogger, useCoreEventLogger } from '../../common/useEventLogger'
import type { EventLogEntry } from '../../common/EventLog.vue'
import type {
	TComponentSize,
	TComponentVariant,
	TTabsOrientation,
	TTabsAlignment,
	TTabsPosition,
	TTabsView,
} from '@core'

type Props = {
	visible?: boolean
	rendered?: boolean
	disabled?: boolean
	size?: TComponentSize
	variant?: TComponentVariant
	orientation?: TTabsOrientation
	alignment?: TTabsAlignment
	position?: TTabsPosition
	view?: TTabsView
	closable?: boolean
	// Tab item props
	tabDisabled?: boolean
	tabClosable?: boolean
	tabApplyTarget?: 'all' | 'first'
}

const props = defineProps<Props>()

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

defineExpose({
	show: () => instance.show(),
	hide: () => instance.hide(),
})

const instance = new TTabs({
	visible: props.visible ?? true,
	rendered: props.rendered ?? true,
	disabled: props.disabled ?? false,
	size: props.size ?? 'normal',
	variant: props.variant ?? 'normal',
	orientation: props.orientation ?? 'horizontal',
	alignment: props.alignment ?? 'start',
	position: props.position ?? 'start',
	view: props.view ?? 'line',
	closable: props.closable ?? false,
})

instance.collection.add({ text: 'Tab 1', value: 'tab1', active: true })
instance.collection.add({ text: 'Tab 2', value: 'tab2' })
instance.collection.add({ text: 'Tab 3', value: 'tab3' })

const { handlers, logEvent } = useEventLogger(emit, emitsTabs)
useCoreEventLogger(instance, logEvent, emitsTabs)

useSyncPropsToInstance(props, instance, [
	'visible',
	'rendered',
	'disabled',
	'size',
	'variant',
	'orientation',
	'alignment',
	'position',
	'view',
	'closable',
])

// Синхронизация свойств вкладок
watch(
	[() => props.tabDisabled, () => props.tabClosable, () => props.tabApplyTarget],
	() => {
		instance.collection.items.forEach((item, index) => {
			const apply = props.tabApplyTarget === 'all' || index === 0
			item.disabled = apply ? !!props.tabDisabled : false
			item.closable = apply ? props.tabClosable : undefined
		})
	},
	{ immediate: true },
)
</script>

<template>
	<PanelDemo info="Instance-based demo">
		<Tabs :ctrl="instance" v-bind="handlers">
			<template #panel:tab1><p>Content for Tab 1</p></template>
			<template #panel:tab2><p>Content for Tab 2</p></template>
			<template #panel:tab3><p>Content for Tab 3</p></template>
		</Tabs>
	</PanelDemo>
</template>

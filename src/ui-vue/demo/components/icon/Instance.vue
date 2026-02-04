<script setup lang="ts">
import { reactive } from 'vue'
import { Icon, useIconImport, emitsIcon } from '@ui/icon'
import { TIcon } from '@core'
import PanelDemo from '../../common/PanelDemo.vue'
import { useSyncPropsToInstance } from '../../common/useSyncPropsToInstance'
import { useEventLogger, useCoreEventLogger } from '../../common/useEventLogger'
import type { EventLogEntry } from '../../common/EventLog.vue'
import type { TComponentSize } from '@core'

type Props = {
	visible?: boolean
	rendered?: boolean
	tag?: string
	size?: TComponentSize
	width?: number | string
	height?: number | string
}

const props = defineProps<Props>()

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

// Используем new TIcon вместо TIcon.create, так как передаем Partial<IIconProps>
const instance = reactive(
	new TIcon({
		tag: useIconImport(props.tag || '/src/icons/home.svg'),
		rendered: props.rendered ?? true,
		visible: props.visible ?? true,
		size: props.size || 'normal',
		width: props.width,
		height: props.height,
	}),
)

defineExpose({
	show: () => instance.show(),
	hide: () => instance.hide(),
})

// Создаем обработчики событий через композабл
const { handlers, logEvent } = useEventLogger(emit, emitsIcon)

// Автоматическая подписка на core события
useCoreEventLogger(instance, logEvent, emitsIcon)

// Синхронизация props с instance (tag требует трансформации через useIconImport)
useSyncPropsToInstance(props, instance, undefined, {
	tag: (value) => useIconImport(value),
})
</script>

<template>
	<PanelDemo info="Managed by TIcon instance">
		<Icon :is="instance" v-bind="handlers" />
	</PanelDemo>
</template>

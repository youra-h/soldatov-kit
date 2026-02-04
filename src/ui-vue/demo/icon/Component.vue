<script setup lang="ts">
import { Icon, useIconImport, emitsIcon } from '@ui/icon'
import PanelDemo from '../common/PanelDemo.vue'
import { useEventLogger } from '../common/useEventLogger'
import type { EventLogEntry } from '../EventLog.vue'
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

// Создаем обработчики событий через композабл
const { handlers } = useEventLogger(emit, emitsIcon)
</script>

<template>
	<PanelDemo info="Controlled by props from Properties panel">
		<Icon
			:tag="useIconImport(tag || '/src/icons/home.svg')"
			:visible="visible"
			:rendered="rendered"
			:size="size"
			:width="width"
			:height="height"
			v-bind="handlers"
		/>
	</PanelDemo>
</template>

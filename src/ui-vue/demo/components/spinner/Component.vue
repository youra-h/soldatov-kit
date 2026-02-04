<script setup lang="ts">
import { Spinner, emitsSpinner } from '@ui/spinner'
import PanelDemo from '../common/PanelDemo.vue'
import { useEventLogger } from '../common/useEventLogger'
import type { EventLogEntry } from '../common/EventLog.vue'
import type { TComponentSize, TComponentVariant } from '@core'

type Props = {
	visible?: boolean
	rendered?: boolean
	size?: TComponentSize
	variant?: TComponentVariant
}

const props = defineProps<Props>()

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

// Создаем обработчики событий через композабл
const { handlers } = useEventLogger(emit, emitsSpinner)
</script>

<template>
	<PanelDemo info="Props-based demo">
		<Spinner
			:visible="visible"
			:rendered="rendered"
			:size="size"
			:variant="variant"
			v-bind="handlers"
		/>
	</PanelDemo>
</template>

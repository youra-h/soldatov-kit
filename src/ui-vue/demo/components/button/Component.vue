<script setup lang="ts">
import { Button, emitsButton } from '@ui/button'
import PanelDemo from '../../common/PanelDemo.vue'
import { useEventLogger } from '../../common/useEventLogger'
import type { EventLogEntry } from '../../common/EventLog.vue'
import type { TComponentSize, TComponentVariant, TButtonAppearance } from '@core'

type Props = {
	visible?: boolean
	rendered?: boolean
	size?: TComponentSize
	variant?: TComponentVariant
	appearance?: TButtonAppearance
	disabled?: boolean
	text?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

// Создаем обработчики событий через композабл
const { handlers } = useEventLogger(emit, emitsButton)
</script>

<template>
	<PanelDemo info="Props-based demo">
		<Button
			:visible="visible"
			:rendered="rendered"
			:size="size"
			:variant="variant"
			:appearance="appearance"
			:disabled="disabled"
			:text="text"
			v-bind="handlers"
		/>
	</PanelDemo>
</template>

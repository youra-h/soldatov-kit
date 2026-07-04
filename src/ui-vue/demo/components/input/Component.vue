<script setup lang="ts">
import { Input, emitsInput } from '@ui/input'
import PanelDemo from '../../common/PanelDemo.vue'
import { useEventLogger } from '../../common/useEventLogger'
import type { EventLogEntry } from '../../common/EventLog.vue'
import type { TComponentSize, TComponentVariant } from '@core'

type Props = {
	visible?: boolean
	rendered?: boolean
	size?: TComponentSize
	variant?: TComponentVariant
	disabled?: boolean
	readonly?: boolean
	required?: boolean
	value?: string
	placeholder?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

const { handlers } = useEventLogger(emit, emitsInput)
</script>

<template>
	<PanelDemo info="Props-based demo">
		<Input
			:visible="visible"
			:rendered="rendered"
			:size="size"
			:variant="variant"
			:disabled="disabled"
			:readonly="readonly"
			:required="required"
			:value="value"
			:placeholder="placeholder"
			v-bind="handlers"
		/>
	</PanelDemo>
</template>

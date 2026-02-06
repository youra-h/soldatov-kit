<script setup lang="ts">
import { Button, emitsButton } from '@ui/button'
import PanelDemo from '../../common/PanelDemo.vue'
import { useEventLogger } from '../../common/useEventLogger'
import type { EventLogEntry } from '../../common/EventLog.vue'
import type { TComponentSize, TComponentVariant, TButtonAppearance } from '@core'
import type { VNode } from 'vue'

type Props = {
	visible?: boolean
	rendered?: boolean
	size?: TComponentSize
	variant?: TComponentVariant
	appearance?: TButtonAppearance
	disabled?: boolean
	text?: string
	// Loading props
	loading?: boolean
	loadingDisabled?: boolean
	spinner?: VNode | null
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
			:disabled="loadingDisabled && loading ? true : disabled"
			:text="text"
			:loading="loading"
			v-bind="handlers"
		>
			<template v-if="loading && spinner" #after>
				<component :is="spinner" />
			</template>
		</Button>
	</PanelDemo>
</template>

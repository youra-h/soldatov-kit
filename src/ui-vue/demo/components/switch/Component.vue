<script setup lang="ts">
import { Switch, emitsSwitch } from '@ui/switch'
import { Icon, useIconImport } from '@ui/icon'
import PanelDemo from '../../common/PanelDemo.vue'
import { useEventLogger } from '../../common/useEventLogger'
import type { EventLogEntry } from '../../common/EventLog.vue'
import type { TComponentSize, TComponentVariant, TInputControlState } from '@core'

type Props = {
	visible?: boolean
	rendered?: boolean
	size?: TComponentSize
	variant?: TComponentVariant
	disabled?: boolean
	readonly?: boolean
	required?: boolean
	invalid?: boolean
	state?: TInputControlState
	value?: boolean | null
	iconBefore?: string
	iconAfter?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

// Создаем обработчики событий через композабл
const { handlers } = useEventLogger(emit, emitsSwitch)
</script>

<template>
	<PanelDemo info="Props-based demo">
		<Switch
			:visible="visible"
			:rendered="rendered"
			:size="size"
			:variant="variant"
			:disabled="disabled"
			:readonly="readonly"
			:required="required"
			:invalid="invalid"
			:state="state"
			:value="value"
			v-bind="handlers"
		>
			<template v-if="iconBefore" #before>
				<Icon :tag="useIconImport(iconBefore)" :size="size" />
			</template>
			<template v-if="iconAfter" #after>
				<Icon :tag="useIconImport(iconAfter)" :size="size" />
			</template>
		</Switch>
	</PanelDemo>
</template>

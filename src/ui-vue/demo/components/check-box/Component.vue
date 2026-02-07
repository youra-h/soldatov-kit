<script setup lang="ts">
import { CheckBox, emitsCheckBox } from '@ui/check-box'
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
	indeterminate?: boolean
	plain?: boolean
	icon?: string
	indeterminateIcon?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

// Создаем обработчики событий через композабл
const { handlers } = useEventLogger(emit, emitsCheckBox)
</script>

<template>
	<PanelDemo info="Props-based demo">
		<CheckBox
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
			:indeterminate="indeterminate"
			:plain="plain"
			v-bind="handlers"
		>
			<template v-if="icon" #icon>
				<Icon :tag="useIconImport(icon)" :size="size" />
			</template>
			<template v-if="indeterminateIcon" #indeterminate-icon>
				<Icon :tag="useIconImport(indeterminateIcon)" :size="size" />
			</template>
		</CheckBox>
	</PanelDemo>
</template>

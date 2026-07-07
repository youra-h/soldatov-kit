<script setup lang="ts">
import { Input, emitsInput } from '@ui/input'
import { Button } from '@ui/button'
import PanelDemo from '../../common/PanelDemo.vue'
import { useEventLogger } from '../../common/useEventLogger'
import type { EventLogEntry } from '../../common/EventLog.vue'
import type { TComponentSize, TComponentVariant } from '@core'
import { Icon, useIconImport } from '@ui/icon'

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

const searchIcon = useIconImport('/src/icons/check.svg')
const closeIcon = useIconImport('/src/icons/close.svg')
</script>

<template>
	<PanelDemo info="Props-based demo">
		<Button class="mr-2" :size="size">Button</Button>
		<Button class="mr-2" :size="size"><Icon :tag="searchIcon" /></Button>
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
		>
			<template #leading>
				<Button size="sm" view="filled"><Icon :tag="searchIcon" /></Button>
				<Button size="sm" view="filled">Text</Button>
			</template>
			<template #trailing>
				<Button :size="size" view="plain"><Icon :tag="closeIcon" /></Button>
			</template>
		</Input>
	</PanelDemo>
</template>

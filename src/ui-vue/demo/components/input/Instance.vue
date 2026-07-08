<script setup lang="ts">
import { Input, emitsInput } from '@ui/input'
import { TInput } from '@core'
import PanelDemo from '../../common/PanelDemo.vue'
import { useSyncPropsToInstance } from '../../common/useSyncPropsToInstance'
import { useEventLogger, useCoreEventLogger } from '../../common/useEventLogger'
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

const instance = new TInput({
	rendered: props.rendered ?? true,
	visible: props.visible ?? true,
	size: props.size || 'normal',
	variant: props.variant || 'normal',
	disabled: props.disabled ?? false,
	readonly: props.readonly ?? false,
	required: props.required ?? false,
	value: props.value ?? '',
	placeholder: props.placeholder ?? '',
})

defineExpose({
	show: () => instance.show(),
	hide: () => instance.hide(),
})

const { handlers, logEvent } = useEventLogger(emit, emitsInput)

useCoreEventLogger(instance, logEvent, emitsInput)

useSyncPropsToInstance(props, instance)
</script>

<template>
	<PanelDemo info="Instance-based demo">
		<Input :ctrl="instance" v-bind="handlers" />
	</PanelDemo>
</template>

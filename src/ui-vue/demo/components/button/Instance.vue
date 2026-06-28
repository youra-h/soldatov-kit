<script setup lang="ts">
import { Button, emitsButton } from '@ui/button'
import { TButton } from '@core'
import PanelDemo from '../../common/PanelDemo.vue'
import { useSyncPropsToInstance } from '../../common/useSyncPropsToInstance'
import { useEventLogger, useCoreEventLogger } from '../../common/useEventLogger'
import type { EventLogEntry } from '../../common/EventLog.vue'
import type { TComponentSize, TComponentVariant, TButtonView } from '@core'

type Props = {
	visible?: boolean
	rendered?: boolean
	size?: TComponentSize
	variant?: TComponentVariant
	view?: TButtonView
	disabled?: boolean
	text?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

const instance = new TButton({
	rendered: props.rendered ?? true,
	visible: props.visible ?? true,
	size: props.size || 'normal',
	variant: props.variant || 'normal',
	view: props.view || 'filled',
	disabled: props.disabled ?? false,
	text: props.text || 'Button',
})

defineExpose({
	show: () => instance.show(),
	hide: () => instance.hide(),
})

const { handlers, logEvent } = useEventLogger(emit, emitsButton)
useCoreEventLogger(instance, logEvent, emitsButton)
useSyncPropsToInstance(props, instance)
</script>

<template>
	<PanelDemo info="Managed by TButton instance">
		<Button :ctrl="instance" v-bind="handlers" />
	</PanelDemo>
</template>

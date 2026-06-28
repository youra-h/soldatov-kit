<script setup lang="ts">
import { Skeleton, emitsSkeleton } from '@ui/skeleton'
import { TSkeleton } from '@core'
import { Button } from '@ui/button'
import PanelDemo from '../../common/PanelDemo.vue'
import { useEventLogger, useCoreEventLogger } from '../../common/useEventLogger'
import { useSyncPropsToInstance } from '../../common/useSyncPropsToInstance'
import type { EventLogEntry } from '../../common/EventLog.vue'
import type { TComponentSize, TComponentVariant, TSkeletonShape, TSkeletonAnimation } from '@core'

type Props = {
	visible?: boolean
	rendered?: boolean
	size?: TComponentSize
	variant?: TComponentVariant
	shape?: TSkeletonShape
	animation?: TSkeletonAnimation
}

const props = defineProps<Props>()

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

const instance = new TSkeleton({
	rendered: props.rendered ?? true,
	visible: props.visible ?? true,
	size: props.size || 'normal',
	variant: props.variant || 'normal',
	shape: props.shape || 'rect',
	animation: props.animation || 'pulse',
})

defineExpose({
	show: () => instance.show(),
	hide: () => instance.hide(),
})

const { handlers, logEvent } = useEventLogger(emit, emitsSkeleton)

useCoreEventLogger(instance, logEvent, emitsSkeleton)

useSyncPropsToInstance(props, instance)
</script>

<template>
	<PanelDemo info="Managed by TSkeleton instance">
		<Skeleton :ctrl="instance" v-bind="handlers">
			<Button>Loaded Content</Button>
		</Skeleton>
	</PanelDemo>
</template>

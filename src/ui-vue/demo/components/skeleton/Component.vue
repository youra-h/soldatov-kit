<script setup lang="ts">
import { Skeleton, emitsSkeleton } from '@ui/skeleton'
import PanelDemo from '../../common/PanelDemo.vue'
import { Button } from '@ui/button'
import { useEventLogger } from '../../common/useEventLogger'
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

const { handlers } = useEventLogger(emit, emitsSkeleton)
</script>

<template>
	<PanelDemo info="Props-based demo">
		<Skeleton
			:visible="visible"
			:rendered="rendered"
			:size="size"
			:variant="variant"
			:shape="shape"
			:animation="animation"
			v-bind="handlers"
		>
			<Button>Loaded Content</Button>
		</Skeleton>
	</PanelDemo>
</template>

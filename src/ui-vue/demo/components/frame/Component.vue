<script setup lang="ts">
import { Frame, emitsFrame } from '@ui/frame'
import PanelDemo from '../../common/PanelDemo.vue'
import { useEventLogger } from '../../common/useEventLogger'
import type { EventLogEntry } from '../../common/EventLog.vue'

type Props = {
	visible?: boolean
	x?: number
	y?: number
	width?: number | string
	height?: number | string
}

const props = defineProps<Props>()

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

const { handlers } = useEventLogger(emit, emitsFrame)
</script>

<template>
	<PanelDemo info="Controlled by props from Properties panel">
		<div class="frame-demo__container">
			<Frame
				:x="x ?? 0"
				:y="y ?? 0"
				:width="width ?? 300"
				:height="height ?? 200"
				:visible="visible ?? false"
				v-bind="handlers"
			>
				<div class="frame-demo__content">
					<p>Frame Content</p>
					<p>Position: ({{ x ?? 0 }}, {{ y ?? 0 }})</p>
					<p>Size: {{ width ?? 300 }} × {{ height ?? 200 }}</p>
				</div>
			</Frame>
			<p class="frame-demo__hint">
				Frame is {{ visible ? 'visible' : 'hidden' }}. Use Properties to toggle.
			</p>
		</div>
	</PanelDemo>
</template>

<style lang="scss" scoped>
.frame-demo {
	&__container {
		@apply relative w-full h-64 bg-gray-50 rounded border border-dashed border-gray-300;
		@apply flex items-center justify-center;
	}

	&__content {
		@apply p-4 bg-white rounded shadow-md border border-gray-200;
		@apply text-sm text-gray-700;
	}

	&__hint {
		@apply text-sm text-gray-400;
	}
}
</style>

<script setup lang="ts">
import { reactive } from 'vue'
import { Frame, emitsFrame } from '@ui/frame'
import { TFrame } from '@core'
import PanelDemo from '../../common/PanelDemo.vue'
import { useEventLogger, useCoreEventLogger } from '../../common/useEventLogger'
import { useSyncPropsToInstance } from '../../common/useSyncPropsToInstance'
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

const instance = new TFrame({
	x: props.x ?? 100,
	y: props.y ?? 100,
	width: props.width ?? 300,
	height: props.height ?? 200,
	visible: props.visible ?? false,
})

defineExpose({
	show: () => instance.show(),
	hide: () => instance.hide(),
	instance,
})

const { handlers, logEvent } = useEventLogger(emit, emitsFrame)
useCoreEventLogger(instance, logEvent, emitsFrame)
useSyncPropsToInstance(props, instance)
</script>

<template>
	<PanelDemo info="Managed by TFrame instance">
		<div class="frame-demo__container">
			<Frame :ctrl="instance" v-bind="handlers">
				<div class="frame-demo__content">
					<p>Instance-managed Frame</p>
					<p>Position: ({{ instance.x }}, {{ instance.y }})</p>
					<p>Size: {{ instance.width }} × {{ instance.height }}</p>
					<p>z-index: {{ instance.zIndex }}</p>
				</div>
			</Frame>
			<div class="frame-demo__actions">
				<button @click="instance.show()">Show</button>
				<button @click="instance.hide()">Hide</button>
				<button @click="instance.x += 50">Move +X</button>
				<button @click="instance.y += 50">Move +Y</button>
			</div>
		</div>
	</PanelDemo>
</template>

<style lang="scss" scoped>
.frame-demo {
	&__container {
		@apply relative w-full h-64 bg-gray-50 rounded border border-dashed border-gray-300;
		@apply flex flex-col items-center justify-center gap-4;
	}

	&__content {
		@apply p-4 bg-white rounded shadow-md border border-gray-200;
		@apply text-sm text-gray-700;
	}

	&__actions {
		@apply flex gap-2;

		button {
			@apply px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600;
		}
	}
}
</style>

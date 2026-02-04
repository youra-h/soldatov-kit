<script setup lang="ts">
import { reactive } from 'vue'
import { ComponentView } from '@ui/component-view'
import { TComponentView } from '@core'
import PanelDemo from '../common/PanelDemo.vue'
import { useSyncPropsToInstance } from '../common/useSyncPropsToInstance'
import { useEventLogger, useCoreEventLogger } from '../common/useEventLogger'
import type { EventLogEntry } from '../EventLog.vue'

type Props = {
	visible?: boolean
	rendered?: boolean
	tag?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

defineExpose({
	show: () => instance.show(),
	hide: () => instance.hide(),
})

const instance = reactive(
	new TComponentView({
		tag: props.tag || 'div',
		rendered: props.rendered ?? true,
		visible: props.visible ?? true,
	}),
)

// Создаем обработчики событий через композабл
const { handlers, logEvent } = useEventLogger(emit)

// Автоматическая подписка на core события
useCoreEventLogger(instance, logEvent)

// Синхронизация props с instance
useSyncPropsToInstance(props, instance)
</script>

<template>
	<PanelDemo info="Managed by TComponentView instance">
		<ComponentView :is="instance" v-bind="handlers">
			<div style="text-align: center">
				<div style="font-weight: 600">Instance Demo</div>
				<div style="font-size: 0.875rem; color: #666">Component with instance</div>
			</div>
		</ComponentView>
	</PanelDemo>
</template>

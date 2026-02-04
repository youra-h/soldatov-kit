<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { ComponentView } from '@ui/component-view'
import { TComponentView } from '@core'
import PanelDemo from '../common/PanelDemo.vue'
import { useSyncPropsToInstance } from '../common/useSyncPropsToInstance'
import { useEventLogger } from '../common/useEventLogger'
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

// Setup core event listeners
onMounted(() => {
	instance.events.on('created' as any, () => logEvent('core', 'created'))
	instance.events.on('beforeShow' as any, () => {
		logEvent('core', 'beforeShow')
		return true
	})
	instance.events.on('afterShow' as any, () => logEvent('core', 'afterShow'))
	instance.events.on('beforeHide' as any, () => {
		logEvent('core', 'beforeHide')
		return true
	})
	instance.events.on('afterHide' as any, () => logEvent('core', 'afterHide'))
	instance.events.on('show' as any, () => logEvent('core', 'show'))
	instance.events.on('hide' as any, () => logEvent('core', 'hide'))
	instance.events.on('change:visible' as any, (v: boolean) =>
		logEvent('core', 'change:visible', v),
	)
	instance.events.on('change:rendered' as any, (v: boolean) =>
		logEvent('core', 'change:rendered', v),
	)
})

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

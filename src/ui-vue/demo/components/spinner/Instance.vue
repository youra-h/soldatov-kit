<script setup lang="ts">
import { reactive } from 'vue'
import { Spinner, emitsSpinner } from '@ui/spinner'
import { TSpinner } from '@core'
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
}

const props = defineProps<Props>()

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

// Создаем инстанс компонента
const instance = reactive(
	new TSpinner({
		rendered: props.rendered ?? true,
		visible: props.visible ?? true,
		size: props.size || 'normal',
		variant: props.variant || 'normal',
	}),
)

defineExpose({
	show: () => instance.show(),
	hide: () => instance.hide(),
})

// Создаем обработчики событий через композабл
const { handlers, logEvent } = useEventLogger(emit, emitsSpinner)

// Автоматическая подписка на core события
useCoreEventLogger(instance, logEvent, emitsSpinner)

// Синхронизация props с instance
useSyncPropsToInstance(props, instance)
</script>

<template>
	<PanelDemo info="Managed by TSpinner instance">
		<Spinner :is="instance" v-bind="handlers" />
	</PanelDemo>
</template>

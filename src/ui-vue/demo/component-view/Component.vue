<script setup lang="ts">
import { ComponentView, emitsComponentView } from '@ui/component-view'
import PanelDemo from '../common/PanelDemo.vue'
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

// Создаем обработчики событий через композабл
const { handlers } = useEventLogger(emit, emitsComponentView)
</script>

<template>
	<PanelDemo info="Controlled by props from Properties panel">
		<ComponentView :tag="tag" :visible="visible" :rendered="rendered" v-bind="handlers">
			<div style="text-align: center">
				<div style="font-weight: 600">Props Demo</div>
				<div style="font-size: 0.875rem; color: #666">Component with props</div>
			</div>
		</ComponentView>
	</PanelDemo>
</template>

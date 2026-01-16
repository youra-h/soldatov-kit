<script setup lang="ts">
import { ComponentView } from '@ui/component-view'
import type { EventLogEntry } from '../EventLog.vue'

type Props = {
	visible?: boolean
	rendered?: boolean
	tag?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
	'log': [entry: EventLogEntry]
}>()

const logEvent = (source: EventLogEntry['source'], name: string, payload?: unknown) => {
	emit('log', {
		timestamp: new Date().toISOString(),
		source,
		name,
		payload
	})
}

// Vue component events
const onCreated = () => logEvent('vue', 'created')
const onBeforeShow = () => logEvent('vue', 'beforeShow')
const onAfterShow = () => logEvent('vue', 'afterShow')
const onBeforeHide = () => logEvent('vue', 'beforeHide')
const onAfterHide = () => logEvent('vue', 'afterHide')
const onShow = () => logEvent('vue', 'show')
const onHide = () => logEvent('vue', 'hide')
const onChangeVisible = (v: boolean) => logEvent('vue', 'change:visible', v)
const onChangeRendered = (v: boolean) => logEvent('vue', 'change:rendered', v)
</script>

<template>
	<ComponentView
		:tag="tag"
		:visible="visible"
		:rendered="rendered"
		@created="onCreated"
		@beforeShow="onBeforeShow"
		@afterShow="onAfterShow"
		@beforeHide="onBeforeHide"
		@afterHide="onAfterHide"
		@show="onShow"
		@hide="onHide"
		@change:visible="onChangeVisible"
		@change:rendered="onChangeRendered"
		class="border-2 border-blue-500 rounded p-4"
	>
		<div class="text-center">
			<div class="font-semibold">Props Demo</div>
			<div class="text-sm text-gray-600">Component with props</div>
		</div>
	</ComponentView>
</template>

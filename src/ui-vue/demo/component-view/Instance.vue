<script setup lang="ts">
import { reactive, onMounted, watch } from 'vue'
import { ComponentView } from '@ui/component-view'
import { TComponentView } from '@core'
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

defineExpose({
	show: () => instance.show(),
	hide: () => instance.hide(),
})

const instance = reactive(new TComponentView({
	tag: props.tag || 'div',
	rendered: props.rendered ?? true,
	visible: props.visible ?? true
}))

const logEvent = (source: EventLogEntry['source'], name: string, payload?: unknown) => {
	emit('log', {
		timestamp: new Date().toISOString(),
		source,
		name,
		payload
	})
}

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
	instance.events.on('change:visible' as any, (v: boolean) => logEvent('core', 'change:visible', v))
	instance.events.on('change:rendered' as any, (v: boolean) => logEvent('core', 'change:rendered', v))
})

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

// Watch props and update instance
watch(() => props.visible, (newVal) => {
	if (newVal !== undefined && instance.visible !== newVal) {
		instance.visible = newVal
	}
})

watch(() => props.rendered, (newVal) => {
	if (newVal !== undefined && instance.rendered !== newVal) {
		instance.rendered = newVal
	}
})

watch(() => props.tag, (newVal) => {
	if (newVal !== undefined && instance.tag !== newVal) {
		instance.tag = newVal
	}
})
</script>

<template>
	<ComponentView
		:is="instance"
		@created="onCreated"
		@beforeShow="onBeforeShow"
		@afterShow="onAfterShow"
		@beforeHide="onBeforeHide"
		@afterHide="onAfterHide"
		@show="onShow"
		@hide="onHide"
		@change:visible="onChangeVisible"
		@change:rendered="onChangeRendered"
		class="instance-demo"
	>
		<div class="instance-demo__content">
			<div class="instance-demo__title">Instance Demo</div>
			<div class="instance-demo__subtitle">Component with instance</div>
		</div>
	</ComponentView>
</template>

<style lang="scss" scoped>
@reference "./../../../foundation/tailwind/index.css";

.instance-demo {
	$this: &;

	@apply border-2 border-green-500;
	@apply rounded;
	@apply p-4;

	&__content {
		@apply text-center;
	}

	&__title {
		@apply font-semibold;
	}

	&__subtitle {
		@apply text-sm;
		@apply text-gray-600;
	}
}
</style>

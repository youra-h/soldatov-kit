<script setup lang="ts">
import { computed, shallowReactive, reactive, ref } from 'vue'
import { ComponentView } from '@ui/component-view'
import { TComponentView } from '@core'
import DemoLayout from './DemoLayout.vue'

const instance = shallowReactive(new TComponentView({ tag: 'div', rendered: true, visible: true }))

const eventLog = ref<string[]>([])
const push = (source: 'core' | 'vue', name: string, payload?: unknown) => {
	const suffix = payload === undefined ? '' : ` ${JSON.stringify(payload)}`
	eventLog.value.unshift(`${source}:${name}${suffix}`)
	if (eventLog.value.length > 50) eventLog.value.length = 50
}

// Core way (instance.events.on)
instance.events.on('created' as any, () => push('core', 'created'))
instance.events.on('beforeShow' as any, () => {
	push('core', 'beforeShow')
	return true
})
instance.events.on('afterShow' as any, () => push('core', 'afterShow'))
instance.events.on('beforeHide' as any, () => {
	push('core', 'beforeHide')
	return true
})
instance.events.on('afterHide' as any, () => push('core', 'afterHide'))
instance.events.on('show' as any, () => push('core', 'show'))
instance.events.on('hide' as any, () => push('core', 'hide'))
instance.events.on('change:visible' as any, (v: boolean) => push('core', 'change:visible', v))
instance.events.on('change:rendered' as any, (v: boolean) => push('core', 'change:rendered', v))

// Vue way (@event)
const onCreated = () => push('vue', 'created')
const onBeforeShow = () => push('vue', 'beforeShow')
const onAfterShow = () => push('vue', 'afterShow')
const onBeforeHide = () => push('vue', 'beforeHide')
const onAfterHide = () => push('vue', 'afterHide')
const onShow = () => push('vue', 'show')
const onHide = () => push('vue', 'hide')
const onChangeVisible = (v: boolean) => push('vue', 'change:visible', v)
const onChangeRendered = (v: boolean) => push('vue', 'change:rendered', v)

const rendered = computed(() => instance.rendered)
const visible = computed(() => instance.visible)

const toggleRendered = () => (instance.rendered = !instance.rendered)
const toggleVisible = () => (instance.visible = !instance.visible)
const show = () => instance.show()
const hide = () => instance.hide()

const onChangeTag = () => {
	const tags = ['div', 'span', 'section', 'article', 'header', 'footer']
	const currentIndex = tags.indexOf(instance.tag as string)
	const nextIndex = (currentIndex + 1) % tags.length
	instance.tag = tags[nextIndex]
}
</script>

<template>
	<DemoLayout title="ComponentView">
		<template #controls>
			<div class="flex flex-wrap gap-2">
				<button @click="onChangeTag">tag: {{ instance.tag }}</button>
				<button type="button" class="px-2 py-1 border rounded" @click="toggleRendered">
					rendered: {{ rendered }}
				</button>
				<button type="button" class="px-2 py-1 border rounded" @click="toggleVisible">
					visible: {{ visible }}
				</button>
				<button type="button" class="px-2 py-1 border rounded" @click="show">show()</button>
				<button type="button" class="px-2 py-1 border rounded" @click="hide">hide()</button>
			</div>
		</template>

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
		>
			ComponentView content
		</ComponentView>

		<!-- <template #events>
			<div class="text-sm whitespace-pre-wrap">
				<div v-for="(line, idx) in eventLog" :key="idx">{{ line }}</div>
			</div>
		</template> -->
	</DemoLayout>
</template>

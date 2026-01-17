<script setup lang="ts">
import { shallowReactive, watch, reactive } from 'vue'
import { Icon, useIconImport } from '@ui/icon'
import { TIcon, type IIconProps } from '@core'
import type { TComponentSize } from '../common/SizeSelector.vue'

type Props = {
	visible?: boolean
	rendered?: boolean
	tag?: string
	size?: TComponentSize
	width?: number | string
	height?: number | string
}

const props = defineProps<Props>()

const instance = shallowReactive(
	TIcon.create({
		tag: useIconImport(props.tag || '/src/icons/home.svg'),
		rendered: props.rendered ?? true,
		visible: props.visible ?? true,
		size: props.size || 'normal',
		width: props.width,
		height: props.height,
	}),
)

// Watch props and update instance
watch(
	() => props.visible,
	(newVal) => {
		if (newVal !== undefined && instance.visible !== newVal) {
			instance.visible = newVal
		}
	},
)

watch(
	() => props.rendered,
	(newVal) => {
		if (newVal !== undefined && instance.rendered !== newVal) {
			instance.rendered = newVal
		}
	},
)

watch(
	() => props.tag,
	(newVal) => {
		if (newVal !== undefined) {
			instance.tag = useIconImport(newVal)
		}
	},
)

watch(
	() => props.size,
	(newVal) => {
		if (newVal !== undefined && instance.size !== newVal) {
			instance.size = newVal
		}
	},
)

watch(
	() => props.width,
	(newVal) => {
		if (newVal !== undefined && instance.width !== newVal) {
			instance.width = newVal
		}
	},
)

watch(
	() => props.height,
	(newVal) => {
		if (newVal !== undefined && instance.height !== newVal) {
			instance.height = newVal
		}
	},
)
</script>

<template>
	<Icon :is="instance" class="instance-demo" />
</template>


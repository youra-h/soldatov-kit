<script setup lang="ts">
import { watch, reactive } from 'vue'
import { Icon, useIconImport } from '@ui/icon'
import { TIcon, type IIconProps } from '@core'
import PanelDemo from '../common/PanelDemo.vue'
import type { TComponentSize } from '@core'

type Props = {
	visible?: boolean
	rendered?: boolean
	tag?: string
	size?: TComponentSize
	width?: number | string
	height?: number | string
}

const props = defineProps<Props>()

// Используем new TIcon вместо TIcon.create, так как передаем Partial<IIconProps>
const instance = reactive(
	new TIcon({
		tag: useIconImport(props.tag || '/src/icons/home.svg'),
		rendered: props.rendered ?? true,
		visible: props.visible ?? true,
		size: props.size || 'normal',
		width: props.width,
		height: props.height,
	}),
)

defineExpose({
	show: () => instance.show(),
	hide: () => instance.hide(),
})

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
	<PanelDemo info="Managed by TIcon instance">
		<Icon :is="instance" />
	</PanelDemo>
</template>

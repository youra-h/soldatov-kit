<script setup lang="ts">
import { watch, reactive } from 'vue'
import { Spinner } from '@ui/spinner'
import { TSpinner, type ISpinnerProps } from '@core'
import type { TComponentSize } from '../common/SizeSelector.vue'
import type { TComponentVariant } from '../common/VariantSelector.vue'

type Props = {
	visible?: boolean
	rendered?: boolean
	size?: TComponentSize
	variant?: TComponentVariant
}

const props = defineProps<Props>()

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
	() => props.size,
	(newVal) => {
		if (newVal !== undefined && instance.size !== newVal) {
			instance.size = newVal
		}
	},
)

watch(
	() => props.variant,
	(newVal) => {
		if (newVal !== undefined && instance.variant !== newVal) {
			instance.variant = newVal
		}
	},
)
</script>

<template>
	<Spinner :is="instance" class="instance-demo" />
</template>

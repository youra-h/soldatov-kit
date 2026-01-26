<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Button } from '@ui/button'
import { TButton, TIcon, TSpinner, TLoadingState } from '@core'
import type { TComponentSize } from '../common/SizeSelector.vue'
import type { TComponentVariant } from '../common/VariantSelector.vue'
import type { TButtonAppearance } from '@core'
import { useIconImport } from '@/ui-vue/components/icon'

type Props = {
	visible?: boolean
	rendered?: boolean
	size?: TComponentSize
	variant?: TComponentVariant
	appearance?: TButtonAppearance
	disabled?: boolean
	loading?: boolean
	loadingShouldDisable?: boolean
	spinnerType?: 'default' | 'small' | 'large' | 'primary' | 'danger'
	text?: string
	icon?: string
}

const props = defineProps<Props>()

// Создаем custom spinner если выбран не default
const createCustomSpinner = () => {
	if (!props.spinnerType || props.spinnerType === 'default') {
		return undefined
	}

	const spinnerConfig: Record<string, { size?: TComponentSize; variant?: TComponentVariant }> = {
		small: { size: 'sm' },
		large: { size: 'lg' },
		primary: { variant: 'primary' },
		danger: { variant: 'danger' },
	}

	const config = spinnerConfig[props.spinnerType]
	if (!config) return undefined

	return new TSpinner({
		props: {
			size: config.size || props.size,
			variant: config.variant || props.variant,
		},
	})
}

// Создаем custom loading state если нужно
const createLoadingState = () => {
	if (props.spinnerType === 'default') {
		return undefined // Используем дефолтное поведение
	}

	const customSpinner = createCustomSpinner()

	return new TLoadingState({
		shouldDisable: props.loadingShouldDisable ?? true,
		createSpinner: customSpinner ? () => customSpinner : undefined,
	})
}

// Создаем инстанс компонента
const instance = reactive(
	new TButton({
		props: {
			rendered: props.rendered ?? true,
			visible: props.visible ?? true,
			size: props.size || 'normal',
			variant: props.variant || 'normal',
			appearance: props.appearance || 'normal',
			disabled: props.disabled ?? false,
			loading: props.loading ?? false,
			text: props.text || 'Button',
			icon: props.icon ? TIcon.getInstance(props.icon) : undefined,
		},
		states: {
			loading: createLoadingState(),
		},
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

watch(
	() => props.appearance,
	(newVal) => {
		if (newVal !== undefined && instance.appearance !== newVal) {
			instance.appearance = newVal
		}
	},
)

watch(
	() => props.disabled,
	(newVal) => {
		if (newVal !== undefined && instance.disabled !== newVal) {
			instance.disabled = newVal
		}
	},
)

watch(
	() => props.loading,
	(newVal) => {
		if (newVal !== undefined && instance.loading !== newVal) {
			instance.loading = newVal
		}
	},
)

watch(
	() => props.text,
	(newVal) => {
		if (newVal !== undefined && instance.text !== newVal) {
			instance.text = newVal
		}
	},
)

watch(
	() => props.icon,
	(newVal) => {
		if (newVal !== undefined) {
			const icon = useIconImport(newVal)

			instance.icon = newVal ? TIcon.getInstance(icon) : undefined
		}
	},
)
</script>

<template>
	<div class="demo-container">
		<h3 class="demo-title">Instance (reactive)</h3>
		<div class="demo-content">
			<Button :is="instance" />
		</div>
		<div class="demo-info">
			Using reactive TButton instance with DI
		</div>
	</div>
</template>

<style lang="scss" scoped>
@reference "./../../../foundation/tailwind/index.css";

.demo-container {
	@apply p-6 bg-white rounded-lg shadow-sm;
}

.demo-title {
	@apply text-base font-semibold mb-4;
}

.demo-content {
	@apply flex items-center justify-center;
	@apply min-h-[100px];
	@apply border-2 border-dashed border-gray-200 rounded;
}

.demo-info {
	@apply mt-4 text-sm text-gray-500 text-center;
}
</style>

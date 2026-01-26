<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@ui/button'
import { TIcon, TSpinner, TLoadingState } from '@core'
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

// Создаем custom loading state если нужно переопределить дефолтное поведение
const loadingState = computed(() => {
	// Если дефолтный тип И дефолтное поведение disabled - используем встроенное
	if (props.spinnerType === 'default' && (props.loadingShouldDisable ?? true)) {
		return undefined
	}

	// Создаем custom spinner если выбран не default
	let customSpinner = undefined
	if (props.spinnerType && props.spinnerType !== 'default') {
		const spinnerConfig: Record<string, { size?: TComponentSize; variant?: TComponentVariant }> = {
			small: { size: 'sm' },
			large: { size: 'lg' },
			primary: { variant: 'primary' },
			danger: { variant: 'danger' },
		}

		const config = spinnerConfig[props.spinnerType]
		if (config) {
			customSpinner = new TSpinner({
				props: {
					size: config.size || props.size,
					variant: config.variant || props.variant,
				},
			})
		}
	}

	return new TLoadingState({
		shouldDisable: props.loadingShouldDisable ?? true,
		createSpinner: customSpinner ? () => customSpinner! : undefined,
	})
})

const iconInstance = computed(() => {
	if (!props.icon) return undefined

	const icon = useIconImport(props.icon)

	return TIcon.getInstance(icon)
})
</script>

<template>
	<div class="demo-container">
		<h3 class="demo-title">Component (props)</h3>
		<div class="demo-content">
			<Button
				:visible="visible"
				:rendered="rendered"
				:size="size"
				:variant="variant"
				:appearance="appearance"
				:disabled="disabled"
				:loading="loading"
				:text="text"
				:icon="iconInstance"
				:states="loadingState ? { loading: loadingState } : undefined"
			/>
		</div>
		<div class="demo-info">
			Controlled by props from Properties panel
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

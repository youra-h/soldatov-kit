<script setup lang="ts">
import { computed } from 'vue'
import { Button, emitsButton } from '@ui/button'
import { TSpinner, TLoadingState } from '@core'
import PanelDemo from '../../common/PanelDemo.vue'
import { useEventLogger } from '../../common/useEventLogger'
import type { EventLogEntry } from '../../common/EventLog.vue'
import type { TComponentSize, TComponentVariant, TButtonAppearance } from '@core'

type SpinnerType = 'none' | 'default' | 'small' | 'large' | 'primary' | 'danger'

type Props = {
	visible?: boolean
	rendered?: boolean
	size?: TComponentSize
	variant?: TComponentVariant
	appearance?: TButtonAppearance
	disabled?: boolean
	text?: string
	// Loading props
	loading?: boolean
	loadingDisabled?: boolean
	spinnerType?: SpinnerType
}

const props = defineProps<Props>()

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

// Создаем обработчики событий через композабл
const { handlers } = useEventLogger(emit, emitsButton)

// Создаем loading state в зависимости от настроек
const loadingState = computed(() => {
	if (!props.loading) return undefined

	// Если spinnerType = 'none', не создаем spinner
	if (props.spinnerType === 'none') {
		return new TLoadingState({
			shouldDisable: props.loadingDisabled,
		})
	}

	// Создаем spinner в зависимости от типа
	const spinnerConfig: Record<string, { size?: TComponentSize; variant?: TComponentVariant }> = {
		default: {},
		small: { size: 'sm' },
		large: { size: 'lg' },
		primary: { variant: 'primary' },
		danger: { variant: 'danger' },
	}

	const config = spinnerConfig[props.spinnerType || 'default']

	return new TLoadingState({
		shouldDisable: props.loadingDisabled,
		createSpinner: () => new TSpinner(config),
	})
})
</script>

<template>
	<PanelDemo info="Props-based demo">
		<Button
			:visible="visible"
			:rendered="rendered"
			:size="size"
			:variant="variant"
			:appearance="appearance"
			:disabled="disabled"
			:text="text"
			:loading-state="loadingState"
			v-bind="handlers"
		/>
	</PanelDemo>
</template>

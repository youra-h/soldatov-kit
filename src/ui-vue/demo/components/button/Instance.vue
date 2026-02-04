<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Button, emitsButton } from '@ui/button'
import { TButton, TSpinner, TLoadingState } from '@core'
import PanelDemo from '../common/PanelDemo.vue'
import { useSyncPropsToInstance } from '../common/useSyncPropsToInstance'
import { useEventLogger, useCoreEventLogger } from '../common/useEventLogger'
import type { EventLogEntry } from '../common/EventLog.vue'
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

// Создаем loading state функцию для реактивного обновления
const createLoadingState = () => {
	if (!props.loading) return undefined

	if (props.spinnerType === 'none') {
		return new TLoadingState({
			shouldDisable: props.loadingDisabled,
		})
	}

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
}

// Создаем инстанс компонента
const instance = reactive(
	new TButton({
		rendered: props.rendered ?? true,
		visible: props.visible ?? true,
		size: props.size || 'normal',
		variant: props.variant || 'normal',
		appearance: props.appearance || 'normal',
		disabled: props.disabled ?? false,
		text: props.text || 'Button',
	}),
)

defineExpose({
	show: () => instance.show(),
	hide: () => instance.hide(),
})

// Создаем обработчики событий через композабл
const { handlers, logEvent } = useEventLogger(emit, emitsButton)

// Автоматическая подписка на core события
useCoreEventLogger(instance, logEvent, emitsButton)

// Синхронизация props с instance (кроме loading-related props)
useSyncPropsToInstance(props, instance, ['loading', 'loadingDisabled', 'spinnerType'])

// Отдельный watch для loading - просто toggle boolean
watch(
	() => props.loading,
	(newVal) => {
		if (newVal !== undefined && instance.loading !== newVal) {
			instance.loading = newVal
		}
	},
)
</script>

<template>
	<PanelDemo info="Managed by TButton instance">
		<Button :is="instance" v-bind="handlers" />
	</PanelDemo>
</template>

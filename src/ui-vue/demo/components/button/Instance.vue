<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Button, emitsButton } from '@ui/button'
import { TButton, TLoadingState } from '@core'
import PanelDemo from '../../common/PanelDemo.vue'
import { useSyncPropsToInstance } from '../../common/useSyncPropsToInstance'
import { useEventLogger, useCoreEventLogger } from '../../common/useEventLogger'
import type { EventLogEntry } from '../../common/EventLog.vue'
import type { TComponentSize, TComponentVariant, TButtonAppearance } from '@core'
import type { VNode } from 'vue'

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
	spinner?: VNode | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

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
useSyncPropsToInstance(props, instance)

// Watch для loading - просто toggle boolean
watch(
	() => props.loading,
	(newVal) => {
		if (newVal !== undefined && instance.loading !== newVal) {
			instance.loading = newVal
		}
	},
)

// Watch для loadingDisabled - управляем shouldDisable в loadingState
watch(
	() => props.loadingDisabled,
	(newVal) => {
		if (newVal !== undefined) {
			instance.loadingState.behavior.shouldDisable = newVal
			// Если loading активен, синхронизируем disabled
			if (instance.loading) {
				instance.disabled = newVal
			}
		}
	},
	{ immediate: true },
)
</script>

<template>
	<PanelDemo info="Managed by TButton instance">
		<Button :is="instance" v-bind="handlers">
			<template v-if="loading && spinner" #after>
				<component :is="spinner" />
			</template>
		</Button>
	</PanelDemo>
</template>

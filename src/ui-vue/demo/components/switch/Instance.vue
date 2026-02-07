<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Switch, emitsSwitch } from '@ui/switch'
import { Icon, useIconImport } from '@ui/icon'
import { TSwitch } from '@core'
import PanelDemo from '../../common/PanelDemo.vue'
import { useSyncPropsToInstance } from '../../common/useSyncPropsToInstance'
import { useEventLogger, useCoreEventLogger } from '../../common/useEventLogger'
import type { EventLogEntry } from '../../common/EventLog.vue'
import type { TComponentSize, TComponentVariant, TInputControlState } from '@core'

type Props = {
	visible?: boolean
	rendered?: boolean
	size?: TComponentSize
	variant?: TComponentVariant
	disabled?: boolean
	readonly?: boolean
	required?: boolean
	invalid?: boolean
	state?: TInputControlState
	value?: boolean | null
	iconBefore?: string
	iconAfter?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

// Создаем инстанс компонента
const instance = reactive(
	new TSwitch({
		rendered: props.rendered ?? true,
		visible: props.visible ?? true,
		size: props.size || 'normal',
		variant: props.variant || 'normal',
		disabled: props.disabled ?? false,
		readonly: props.readonly ?? false,
		required: props.required ?? false,
		invalid: props.invalid ?? false,
		state: props.state || 'normal',
		value: props.value ?? false,
	}),
)

defineExpose({
	show: () => instance.show(),
	hide: () => instance.hide(),
})

// Создаем обработчики событий через композабл
const { handlers, logEvent } = useEventLogger(emit, emitsSwitch)

// Автоматическая подписка на core события
useCoreEventLogger(instance, logEvent, emitsSwitch)

// Синхронизация props с instance
useSyncPropsToInstance(props, instance)

// Дополнительная синхронизация value
watch(
	() => props.value,
	(newVal) => {
		if (newVal !== undefined && instance.value !== newVal) {
			instance.value = newVal
		}
	},
)
</script>

<template>
	<PanelDemo info="Managed by TSwitch instance">
		<Switch :is="instance" v-bind="handlers">
			<template v-if="iconBefore" #before>
				<Icon :tag="useIconImport(iconBefore)" :size="instance.size" />
			</template>
			<template v-if="iconAfter" #after>
				<Icon :tag="useIconImport(iconAfter)" :size="instance.size" />
			</template>
		</Switch>
	</PanelDemo>
</template>

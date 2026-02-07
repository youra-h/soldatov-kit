<script setup lang="ts">
import { reactive, watch } from 'vue'
import { CheckBox, emitsCheckBox } from '@ui/check-box'
import { Icon, useIconImport } from '@ui/icon'
import { TCheckBox } from '@core'
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
	indeterminate?: boolean
	plain?: boolean
	icon?: string
	indeterminateIcon?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
	log: [entry: EventLogEntry]
}>()

// Создаем инстанс компонента
const instance = reactive(
	new TCheckBox({
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
		indeterminate: props.indeterminate ?? false,
		plain: props.plain ?? false,
	}),
)

defineExpose({
	show: () => instance.show(),
	hide: () => instance.hide(),
})

// Создаем обработчики событий через композабл
const { handlers, logEvent } = useEventLogger(emit, emitsCheckBox)

// Автоматическая подписка на core события
useCoreEventLogger(instance, logEvent, emitsCheckBox)

// Синхронизация props с instance
useSyncPropsToInstance(props, instance)

// Дополнительная синхронизация value и indeterminate
watch(
	() => props.value,
	(newVal) => {
		if (newVal !== undefined && instance.value !== newVal) {
			instance.value = newVal
		}
	},
)

watch(
	() => props.indeterminate,
	(newVal) => {
		if (newVal !== undefined && instance.indeterminate !== newVal) {
			instance.indeterminate = newVal
		}
	},
)
</script>

<template>
	<PanelDemo info="Managed by TCheckBox instance">
		<CheckBox :is="instance" v-bind="handlers">
			<template v-if="icon" #icon>
				<Icon :tag="useIconImport(icon)" :size="instance.size" />
			</template>
			<template v-if="indeterminateIcon" #indeterminate-icon>
				<Icon :tag="useIconImport(indeterminateIcon)" :size="instance.size" />
			</template>
		</CheckBox>
	</PanelDemo>
</template>

import type { PropType } from 'vue'
import { watch } from 'vue'
import { type IInteractive, type IInteractiveProps, TInteractive } from '../../../core'
import {
	BaseComponentView,
	emitsComponentView,
	propsComponentView,
	syncComponentView,
} from '../component-view'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../types'

export const emitsInteractive: TEmits = [
	...emitsComponentView,
	'change:disabled',
	'update:disabled',
	'disabled',
	'change:focused',
	'update:focused',
	'focused',
	'click',
] as const

export const propsInteractive: TProps = {
	...propsComponentView,
	disabled: {
		type: Boolean as PropType<IInteractiveProps['disabled']>,
		default: TInteractive.defaultValues.disabled,
	},
	focused: {
		type: Boolean as PropType<IInteractiveProps['focused']>,
		default: TInteractive.defaultValues.focused,
	},
}

export default {
	name: 'BaseInteractive',
	extends: BaseComponentView,
	emits: emitsInteractive,
	props: propsInteractive,
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncInteractive(
	options: ISyncComponentModelOptions<IInteractiveProps, IInteractive>,
) {
	syncComponentView(options)

	const { instance, props, emit } = options

	// Пробрасываем события core-инстанса наружу (Vue events).
	instance.events.on('change:disabled' as any, (value: boolean) => {
		emit?.('change:disabled', value)
		emit?.('disabled', value)
		emit?.('update:disabled', value)
	})

	instance.events.on('change:focused' as any, (value: boolean) => {
		emit?.('change:focused', value)
		emit?.('focused', value)
		emit?.('update:focused', value)
	})

	instance.events.on('click' as any, (event: Event) => {
		emit?.('click', event)
	})

	watch<boolean | undefined>(
		() => props.disabled,
		(value) => {
			if (value !== undefined && value !== instance.disabled) {
				instance.disabled = value
			}
		},
	)

	watch<boolean | undefined>(
		() => props.focused,
		(value) => {
			if (value !== undefined && value !== instance.focused) {
				instance.focused = value
			}
		},
	)
}

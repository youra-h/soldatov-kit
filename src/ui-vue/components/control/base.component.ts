import type { PropType } from 'vue'
import { watch } from 'vue'
import { type IControl, type IControlProps, TControl } from '@core'
import { BaseStylable, emitsStylable, propsStylable, syncStylable } from '../stylable'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../types'

export const emitsControl: TEmits = [
	...emitsStylable,
	'change:disabled',
	'update:disabled',
	'disabled',
	'change:focused',
	'update:focused',
	'focused',
	'click',
] as const

export const propsControl: TProps = {
	...propsStylable,
	disabled: {
		type: Boolean as PropType<IControlProps['disabled']>,
		default: TControl.defaultValues.disabled,
	},
	focused: {
		type: Boolean as PropType<IControlProps['focused']>,
		default: TControl.defaultValues.focused,
	},
}

export default {
	name: 'BaseControl',
	extends: BaseStylable,
	emits: emitsControl,
	props: propsControl,
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncControl(options: ISyncComponentModelOptions<IControlProps, IControl>) {
	syncStylable(options)

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

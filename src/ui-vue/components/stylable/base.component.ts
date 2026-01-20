import type { PropType } from 'vue'
import { watch } from 'vue'
import { type IStylable, type IStylableProps, TStylable } from '../../../core'
import type { TComponentSize, TComponentVariant } from '../../../core'
import {
	BaseComponentView,
	emitsComponentView,
	propsComponentView,
	syncComponentView,
} from '../component-view'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../types'

export const emitsStylable: TEmits = [
	...emitsComponentView,
	'change:size',
	'update:size',
	'size',
	'change:variant',
	'update:variant',
	'variant',
] as const

export const propsStylable: TProps = {
	...propsComponentView,
	size: {
		type: String as PropType<IStylableProps['size']>,
		default: TStylable.defaultValues.size,
	},
	variant: {
		type: String as PropType<IStylableProps['variant']>,
		default: TStylable.defaultValues.variant,
	},
}

export default {
	name: 'BaseStylable',
	extends: BaseComponentView,
	emits: emitsStylable,
	props: propsStylable,
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncStylable(options: ISyncComponentModelOptions<IStylableProps, IStylable>) {
	syncComponentView(options)

	const { instance, props, emit } = options

	// Пробрасываем события core-инстанса наружу (Vue events).
	instance.events.on('change:size' as any, (value: TComponentSize) => {
		emit?.('change:size', value)
		emit?.('size', value)
		emit?.('update:size', value)
	})

	instance.events.on('change:variant' as any, (value: TComponentVariant) => {
		emit?.('change:variant', value)
		emit?.('variant', value)
		emit?.('update:variant', value)
	})

	watch<TComponentSize | undefined>(
		() => props.size,
		(value) => {
			if (value !== undefined && value !== instance.size) {
				instance.size = value
			}
		},
	)

	watch<TComponentVariant | undefined>(
		() => props.variant,
		(value) => {
			if (value !== undefined && value !== instance.variant) {
				instance.variant = value
			}
		},
	)
}

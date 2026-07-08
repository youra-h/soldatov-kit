import type { PropType, Ref } from 'vue'
import { watch } from 'vue'
import { TStylable } from '@core'
import type {
	IStylable,
	IStylableProps,
	TComponentSize,
	TComponentVariant,
	TValuePayload,
} from '@core'
import {
	BaseComponentView,
	emitsComponentView,
	propsComponentView,
	syncComponentView,
	type IComponentViewState,
} from '../component-view'
import type { TEmits, TProps, ISyncComponentOptions } from '../../types'
import { useSyncProps } from '../../composables/useSyncProps'
import { useInheritProps } from '../../composables/useInheritProps'

export const emitsStylable: TEmits = [
	...emitsComponentView,
	'change:size',
	'update:size',
	'change:variant',
	'update:variant',
] as const

export const propsStylable: TProps = {
	...useInheritProps(propsComponentView, TStylable),
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

export interface IStylableState extends IComponentViewState {
	size: Ref<TComponentSize>
	variant: Ref<TComponentVariant>
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncStylable(
	options: ISyncComponentOptions<IStylableProps, IStylable>,
): IStylableState {
	const syncProps = syncComponentView(options)

	const { instance, props, emit } = options

	// Пробрасываем события core-инстанса наружу (Vue events).
	instance.events.on('change:size', (payload: TValuePayload<TComponentSize>) => {
		emit?.('change:size', payload)
		emit?.('update:size', payload)
	})

	instance.events.on('change:variant', (payload: TValuePayload<TComponentVariant>) => {
		emit?.('change:variant', payload)
		emit?.('update:variant', payload)
	})

	watch<TComponentSize | undefined>(
		() => props.size,
		(value) => {
			if (value !== undefined && value !== instance.size) {
				instance.size = value
			}
		}
	)

	watch<TComponentVariant | undefined>(
		() => props.variant,
		(value) => {
			if (value !== undefined && value !== instance.variant) {
				instance.variant = value
			}
		},
	)

	return {
		...syncProps,
		...useSyncProps(instance.events, {
			size: () => instance.size,
			variant: () => instance.variant,
		}),
	}
}

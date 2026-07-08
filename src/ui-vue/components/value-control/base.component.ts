import type { PropType, Ref, UnwrapRef } from 'vue'
import { watch } from 'vue'
import { type IValueControl, type IValueControlProps, TValueControl } from '@core'
import { BaseControl, emitsControl, propsControl, syncControl, type IControlState } from '../control'
import type { TEmits, TProps, ISyncComponentOptions } from '../../types'
import { useSyncProps } from '../../composables/useSyncProps'
import { useInheritProps } from '../../composables/useInheritProps'

export const emitsValueControl: TEmits = [
	...emitsControl,
	'change:value',
	'update:value',
	'input:value',
	'input',
	'change:name',
	'update:name',
] as const

export const propsValueControl: TProps = {
	...useInheritProps(propsControl, TValueControl),
	value: {
		type: [String, Number, Boolean, Object, Array] as PropType<any>,
		default: TValueControl.defaultValues.value,
	},
	name: {
		type: String as PropType<IValueControlProps<any>['name']>,
		default: TValueControl.defaultValues.name,
	},
}

export default {
	name: 'BaseValueControl',
	extends: BaseControl,
	emits: emitsValueControl,
	props: propsValueControl,
}

export interface IValueControlState<TValue = any> extends IControlState {
	value: Ref<TValue | UnwrapRef<TValue>>
	name: Ref<string>
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncValueControl<TValue>(
	options: ISyncComponentOptions<IValueControlProps<TValue>, IValueControl<TValue>>,
): IValueControlState<TValue> {
	const syncProps = syncControl(options)

	const { instance, props, emit } = options

	// Пробрасываем события core-инстанса наружу (Vue events).
	instance.events.on('change:value' as any, (value: TValue) => {
		emit?.('change:value', value)
		emit?.('update:value', value)
	})

	instance.events.on('input:value' as any, (value: TValue) => {
		emit?.('input:value', value)
		emit?.('input', value)
	})

	instance.events.on('change:name' as any, (value: string) => {
		emit?.('change:name', value)
		emit?.('update:name', value)
	})

	watch(
		() => props.value,
		(value) => {
			if (value !== undefined && value !== instance.value) {
				instance.value = value as TValue
			}
		},
	)

	watch<string | undefined>(
		() => props.name,
		(value) => {
			if (value !== undefined && value !== instance.name) {
				instance.name = value
			}
		},
	)

	return {
		...syncProps,
		...useSyncProps(instance.events, {
			value: () => instance.value,
			name: () => instance.name,
		}),
	}
}

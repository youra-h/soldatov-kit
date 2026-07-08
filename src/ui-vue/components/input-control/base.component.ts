import type { PropType, Ref } from 'vue'
import { watch } from 'vue'
import { type IInputControl, type IInputControlProps, TInputControl } from '@core'
import {
	BaseValueControl,
	emitsValueControl,
	propsValueControl,
	syncValueControl,
	type IValueControlState,
} from '../value-control'
import type { TEmits, TProps, ISyncComponentOptions } from '../../types'
import { useSyncProps } from '../../composables/useSyncProps'
import { useInheritProps } from '../../composables/useInheritProps'

export const emitsInputControl: TEmits = [
	...emitsValueControl,
	'change:readonly',
	'update:readonly',
	'change:required',
	'update:required',
] as const

export const propsInputControl: TProps = {
	...useInheritProps(propsValueControl, TInputControl),
	readonly: {
		type: Boolean as PropType<IInputControlProps<any>['readonly']>,
		default: TInputControl.defaultValues.readonly,
	},
	required: {
		type: Boolean as PropType<IInputControlProps<any>['required']>,
		default: TInputControl.defaultValues.required,
	},
}

export default {
	name: 'BaseInputControl',
	extends: BaseValueControl,
	emits: emitsInputControl,
	props: propsInputControl,
}

export interface IInputControlState<TValue = any> extends IValueControlState<TValue> {
	readonly: Ref<boolean>
	required: Ref<boolean>
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncInputControl<TValue = string>(
	options: ISyncComponentOptions<IInputControlProps<TValue>, IInputControl<TValue>>,
): IInputControlState<TValue> {
	const syncProps = syncValueControl(options)

	const { instance, props, emit } = options

	// Пробрасываем события core-инстанса наружу (Vue events).
	instance.events.on('change:readonly' as any, (value: boolean) => {
		emit?.('change:readonly', value)
		emit?.('update:readonly', value)
	})

	instance.events.on('change:required' as any, (value: boolean) => {
		emit?.('change:required', value)
		emit?.('update:required', value)
	})

	watch<boolean | undefined>(
		() => props.readonly,
		(value) => {
			if (value !== undefined && value !== instance.readonly) {
				instance.readonly = value
			}
		},
	)

	watch<boolean | undefined>(
		() => props.required,
		(value) => {
			if (value !== undefined && value !== instance.required) {
				instance.required = value
			}
		},
	)

	return {
		...syncProps,
		...useSyncProps(instance.events as any, {
			readonly: () => instance.readonly,
			required: () => instance.required,
		}),
	}
}

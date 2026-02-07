import type { PropType } from 'vue'
import { watch } from 'vue'
import {
	type IInputControl,
	type IInputControlProps,
	TInputControl,
	type TInputControlState,
} from '../../../core'
import {
	BaseValueControl,
	emitsValueControl,
	propsValueControl,
	syncValueControl,
} from '../value-control'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../types'

export const emitsInputControl: TEmits = [
	...emitsValueControl,
	'change:readonly',
	'update:readonly',
	'readonly',
	'change:required',
	'update:required',
	'required',
	'change:invalid',
	'update:invalid',
	'invalid',
	'change:state',
	'update:state',
	'state',
	'change:loading',
	'update:loading',
	'loading',
] as const

export const propsInputControl: TProps = {
	...propsValueControl,
	readonly: {
		type: Boolean as PropType<IInputControlProps<any>['readonly']>,
		default: TInputControl.defaultValues.readonly,
	},
	required: {
		type: Boolean as PropType<IInputControlProps<any>['required']>,
		default: TInputControl.defaultValues.required,
	},
	invalid: {
		type: Boolean as PropType<IInputControlProps<any>['invalid']>,
		default: TInputControl.defaultValues.invalid,
	},
	state: {
		type: String as PropType<IInputControlProps<any>['state']>,
		default: TInputControl.defaultValues.state,
	},
}

export default {
	name: 'BaseInputControl',
	extends: BaseValueControl,
	emits: emitsInputControl,
	props: propsInputControl,
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncInputControl<TValue = string>(
	options: ISyncComponentModelOptions<IInputControlProps<TValue>, IInputControl<TValue>>,
) {
	syncValueControl(options)

	const { instance, props, emit } = options

	// Пробрасываем события core-инстанса наружу (Vue events).
	instance.events.on('change:readonly' as any, (value: boolean) => {
		emit?.('change:readonly', value)
		emit?.('readonly', value)
		emit?.('update:readonly', value)
	})

	instance.events.on('change:required' as any, (value: boolean) => {
		emit?.('change:required', value)
		emit?.('required', value)
		emit?.('update:required', value)
	})

	instance.events.on('change:invalid' as any, (value: boolean) => {
		emit?.('change:invalid', value)
		emit?.('invalid', value)
		emit?.('update:invalid', value)
	})

	instance.events.on('change:state' as any, (value: TInputControlState) => {
		emit?.('change:state', value)
		emit?.('state', value)
		emit?.('update:state', value)
	})

	instance.events.on('change:loading' as any, (value: boolean) => {
		emit?.('change:loading', value)
		emit?.('loading', value)
		emit?.('update:loading', value)
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

	watch<boolean | undefined>(
		() => props.invalid,
		(value) => {
			if (value !== undefined && value !== instance.invalid) {
				instance.invalid = value
			}
		},
	)

	watch<TInputControlState | undefined>(
		() => props.state,
		(value) => {
			if (value !== undefined && value !== instance.state) {
				instance.state = value
			}
		},
	)
}

import { type PropType, watch } from 'vue'
import {
	type IControlInputProps,
	TControlInput,
	type TComponentVariant,
	type TControlInputState,
	TSpinner,
} from '../../../core'
import {
	BaseControlValue,
	emitsControlValue,
	propsControlValue,
	syncControlValue,
} from '../control-value'
import type { TEmits, TProps, ISyncComponentOptions } from '../../types/common'

export const emitsControlInput: TEmits = [...emitsControlValue] as const

export const propsControlInput: TProps = {
	...propsControlValue,
	variant: {
		type: String as PropType<IControlInputProps['variant']>,
		default: TControlInput.defaultValues.variant,
	},
	readonly: {
		type: Boolean as PropType<IControlInputProps['readonly']>,
		default: TControlInput.defaultValues.readonly,
	},
	required: {
		type: Boolean as PropType<IControlInputProps['required']>,
		default: TControlInput.defaultValues.required,
	},
	invalid: {
		type: Boolean as PropType<IControlInputProps['invalid']>,
		default: TControlInput.defaultValues.invalid,
	},
	state: {
		type: String as PropType<IControlInputProps['state']>,
		default: TControlInput.defaultValues.state,
	},
	loading: {
		type: Boolean as PropType<IControlInputProps['loading']>,
		default: TControlInput.defaultValues.loading,
	},
	spinner: {
		type: Object as PropType<IControlInputProps['spinner']>,
		default: TControlInput.defaultValues.spinner,
	},
}

export default {
	name: 'BaseControlInput',
	extends: BaseControlValue,
	emits: emitsControlInput,
	props: propsControlInput,
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncControlInput(options: ISyncComponentOptions<IControlInputProps>): void {
	syncControlValue(options)

	const { instance, props, emit } = options

	watch<TComponentVariant>(
		() => props.variant,
		(value) => {
			if (value !== instance.variant) {
				instance.variant = value
			}
		},
	)

	watch<boolean>(
		() => props.readonly,
		(value) => {
			if (value !== instance.readonly) {
				instance.readonly = value
			}
		},
	)

	watch<boolean>(
		() => props.required,
		(value) => {
			if (value !== instance.required) {
				instance.required = value
			}
		},
	)

	watch<boolean>(
		() => props.invalid,
		(value) => {
			if (value !== instance.invalid) {
				instance.invalid = value
			}
		},
	)

	watch<TControlInputState>(
		() => props.state,
		(value) => {
			if (value !== instance.state) {
				instance.state = value
			}
		},
	)

	watch<boolean>(
		() => props.loading,
		(value) => {
			if (value !== instance.loading) {
				instance.loading = value
			}
		},
	)

	watch<TSpinner | undefined>(
		() => props.spinner,
		(value) => {
			if (value && value !== instance.spinner) {
				instance.spinner = value
			}
		},
	)
}

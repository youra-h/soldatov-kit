import { type PropType, watch } from 'vue'
import {
	type IControlInput,
	defaultValuesControlInput,
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
import type { TEmits, TProps, ISyncComponentOptions } from '../../common/types'

export const emitsControlInput: TEmits = [...emitsControlValue] as const

export const propsControlInput: TProps = {
	...propsControlValue,
	variant: {
		type: String as PropType<IControlInput['variant']>,
		default: defaultValuesControlInput.variant,
	},
	readonly: {
		type: Boolean as PropType<IControlInput['readonly']>,
		default: defaultValuesControlInput.readonly,
	},
	required: {
		type: Boolean as PropType<IControlInput['required']>,
		default: defaultValuesControlInput.required,
	},
	invalid: {
		type: Boolean as PropType<IControlInput['invalid']>,
		default: defaultValuesControlInput.invalid,
	},
	state: {
		type: String as PropType<IControlInput['state']>,
		default: defaultValuesControlInput.state,
	},
	loading: {
		type: Boolean as PropType<IControlInput['loading']>,
		default: defaultValuesControlInput.loading,
	},
	spinner: {
		type: Object as PropType<IControlInput['spinner']>,
		default: defaultValuesControlInput.spinner,
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
export function syncControlInput(options: ISyncComponentOptions<IControlInput>): void {
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

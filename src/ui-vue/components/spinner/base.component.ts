import { type PropType, watch } from 'vue'
import {
	type ISpinnerProps,
	TSpinner,
	type TComponentSize,
	type TComponentVariant,
	type ISpinner,
} from '../../../core'
import {
	ComponentView,
	emitsComponentView,
	propsComponentView,
	syncComponentView,
} from '../component-view'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../types/common'

export const emitsSpinner: TEmits = [...emitsComponentView] as const

export const propsSpinner: TProps = {
	...propsComponentView,
	variant: {
		type: String as PropType<ISpinnerProps['variant']>,
		default: TSpinner.defaultValues.variant,
	},
	size: {
		type: String as PropType<ISpinnerProps['size']>,
		default: TSpinner.defaultValues.size,
	},
	borderWidth: {
		type: [String, Number] as PropType<ISpinnerProps['borderWidth']>,
		default: TSpinner.defaultValues.borderWidth,
	},
}

export default {
	name: 'BaseSpinner',
	extends: ComponentView,
	emits: emitsSpinner,
	props: propsSpinner,
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncSpinner(options: ISyncComponentModelOptions<ISpinnerProps, ISpinner>) {
	syncComponentView(options)

	const { instance, props } = options

	watch<TComponentVariant | undefined>(
		() => props.variant,
		(value) => {
			if (value !== undefined && value !== instance.variant) {
				instance.variant = value
			}
		},
	)

	watch<TComponentSize | undefined>(
		() => props.size,
		(value) => {
			if (value !== undefined && value !== instance.size) {
				instance.size = value
			}
		},
	)

	watch<'auto' | number | undefined>(
		() => props.borderWidth,
		(value) => {
			if (value !== undefined && value !== instance.borderWidth) {
				instance.borderWidth = value
			}
		},
	)
}

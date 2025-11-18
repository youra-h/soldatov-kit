import { type PropType, watch } from 'vue'
import {
	type ISpinnerProps,
	TSpinner,
	type TComponentSize,
	type TComponentVariant,
} from '../../../core'
import { Component, emitsComponent, propsComponent, syncComponent } from '../component'
import type { TEmits, TProps, ISyncComponentOptions } from '../../common/types'

export const emitsSpinner: TEmits = [...emitsComponent] as const

export const propsSpinner: TProps = {
	...propsComponent,
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
	extends: Component,
	emits: emitsSpinner,
	props: propsSpinner,
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncSpinner(options: ISyncComponentOptions<ISpinnerProps>) {
	syncComponent(options)

	const { instance, props } = options

	watch<TComponentVariant>(
		() => props.variant,
		(value) => {
			if (value && value !== instance.variant) {
				instance.variant = value
			}
		},
	)

	watch<TComponentSize>(
		() => props.size,
		(value) => {
			if (value && value !== instance.size) {
				instance.size = value
			}
		},
	)

	watch<'auto' | number>(
		() => props.borderWidth,
		(value) => {
			if (value !== instance.borderWidth) {
				instance.borderWidth = value
			}
		},
	)
}

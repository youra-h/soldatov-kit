import { type PropType, watch } from 'vue'
import {
	type ISpinner,
	defaultSpinnerValues,
	type TComponentSize,
	type TComponentVariant,
} from '../../../core'
import { Component, componentEmits, componentProps, syncComponent } from '../component'
import type { TEmits, TProps } from '../../common/types'

export const spinnerEmits: TEmits = [...componentEmits] as const

export const spinnerProps: TProps = {
	...componentProps,
	variant: {
		type: String as PropType<ISpinner['variant']>,
		default: defaultSpinnerValues.variant,
	},
	size: {
		type: String as PropType<ISpinner['size']>,
		default: defaultSpinnerValues.size,
	},
	borderWidth: {
		type: [String, Number] as PropType<ISpinner['borderWidth']>,
		default: defaultSpinnerValues.borderWidth,
	},
}

export default {
	name: 'BaseSpinner',
	extends: Component,
	emits: spinnerEmits,
	props: spinnerProps,
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncSpinner(props: TProps, instance: ISpinner) {
	syncComponent(props, instance)

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
		{ immediate: true },
	)
}

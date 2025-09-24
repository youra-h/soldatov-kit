import { type PropType, watch } from 'vue'
import {
	type ISpinner,
	defaultValuesSpinner,
	type TComponentSize,
	type TComponentVariant,
} from '../../../core'
import { Component, emitsComponent, propsComponent, syncComponent } from '../component'
import type { TEmits, TProps } from '../../common/types'

export const emitsSpinner: TEmits = [...emitsComponent] as const

export const propsSpinner: TProps = {
	...propsComponent,
	variant: {
		type: String as PropType<ISpinner['variant']>,
		default: defaultValuesSpinner.variant,
	},
	size: {
		type: String as PropType<ISpinner['size']>,
		default: defaultValuesSpinner.size,
	},
	borderWidth: {
		type: [String, Number] as PropType<ISpinner['borderWidth']>,
		default: defaultValuesSpinner.borderWidth,
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
		}
	)
}

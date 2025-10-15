import { type PropType, watch } from 'vue'
import {
	type ITabs,
	defaultValuesTabs,
	type TComponentSize,
	type TComponentVariant,
} from '../../../core'
import { Component, emitsComponent, propsComponent, syncComponent } from '../component'
import type { TEmits, TProps, ISyncComponentOptions } from '../../common/types'

export const emitsTabs: TEmits = [...emitsComponent] as const

export const propsTabs: TProps = {
	...propsComponent,
	variant: {
		type: String as PropType<ITabs['variant']>,
		default: defaultValuesTabs.variant,
	},
	size: {
		type: String as PropType<ITabs['size']>,
		default: defaultValuesTabs.size,
	},
	borderWidth: {
		type: [String, Number] as PropType<ITabs['borderWidth']>,
		default: defaultValuesTabs.borderWidth,
	},
}

export default {
	name: 'BaseTabs',
	extends: Component,
	emits: emitsTabs,
	props: propsTabs,
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncTabs(options: ISyncComponentOptions<ITabs>) {
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

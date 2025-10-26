import { type PropType, watch } from 'vue'
import { type ITabItem, type TComponentSize, type TComponentVariant } from '../../../../core'
import { Component, emitsComponent, propsComponent, syncComponent } from '../component'
import type { TEmits, TProps, ISyncComponentOptions } from '../../common/types'

export const emitsTabItem: TEmits = [...emitsComponent] as const

export const propsTabItem: TProps = {
	...propsComponent,
	variant: {
		type: String as PropType<ITabItem['variant']>,
		default: defaultValuesTabItem.variant,
	},
	size: {
		type: String as PropType<ITabItem['size']>,
		default: defaultValuesTabItem.size,
	},
	borderWidth: {
		type: [String, Number] as PropType<ITabItem['borderWidth']>,
		default: defaultValuesTabItem.borderWidth,
	},
}

export default {
	name: 'BaseTabItem',
	extends: Component,
	emits: emitsTabItem,
	props: propsTabItem,
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncTabItem(options: ISyncComponentOptions<ITabItem>) {
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

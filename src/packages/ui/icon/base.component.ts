import { type PropType, watch } from 'vue'
import { type IIcon, defaultValuesIcon, type TIconSize } from '../../../core'
import { Component, emitsComponent, propsComponent, syncComponent } from '../component'
import type { TEmits, TProps, ISyncComponentOptions } from '../../common/types'

export const emitsIcon: TEmits = [...emitsComponent] as const

export const propsIcon: TProps = {
	...propsComponent,
	tag: {
		type: [String, Object] as PropType<IIcon['tag']>,
		default: defaultValuesIcon.tag,
	},
	size: {
		type: String as PropType<IIcon['size']>,
		default: defaultValuesIcon.size,
	},
	width: {
		type: [Number, String] as PropType<IIcon['width']>,
		default: defaultValuesIcon.width,
	},
	height: {
		type: [Number, String] as PropType<IIcon['height']>,
		default: defaultValuesIcon.height,
	},
}

export default {
	name: 'BaseIcon',
	extends: Component,
	emits: emitsIcon,
	props: propsIcon,
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncIcon(options: ISyncComponentOptions<IIcon>) {
	syncComponent(options)

	const { instance, props } = options

	watch<TIconSize>(
		() => props.size,
		(value) => {
			if (value && value !== instance.size) {
				instance.size = value
			}
		},
	)

	watch<number | string | undefined>(
		() => props.width,
		(value) => {
			if (value && value !== instance.width) {
				instance.width = value
			}
		},
	)

	watch<number | string | undefined>(
		() => props.height,
		(value) => {
			if (value && value !== instance.height) {
				instance.height = value
			}
		},
	)
}

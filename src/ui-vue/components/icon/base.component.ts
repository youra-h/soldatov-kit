import { type PropType, watch } from 'vue'
import { type IIconProps, TIcon, type TComponentSize } from '../../../core'
import { Component, emitsComponent, propsComponent, syncComponent } from '../presentable'
import type { TEmits, TProps, ISyncComponentOptions } from '../../types/common'

export const emitsIcon: TEmits = [...emitsComponent] as const

export const propsIcon: TProps = {
	...propsComponent,
	tag: {
		type: [String, Object] as PropType<IIconProps['tag']>,
		default: TIcon.defaultValues.tag,
	},
	size: {
		type: String as PropType<IIconProps['size']>,
		default: TIcon.defaultValues.size,
	},
	width: {
		type: [Number, String] as PropType<IIconProps['width']>,
		default: TIcon.defaultValues.width,
	},
	height: {
		type: [Number, String] as PropType<IIconProps['height']>,
		default: TIcon.defaultValues.height,
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
export function syncIcon(options: ISyncComponentOptions<IIconProps>) {
	syncComponent(options)

	const { instance, props } = options

	watch<TComponentSize>(
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

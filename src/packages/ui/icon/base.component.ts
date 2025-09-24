import { type PropType, watch } from 'vue'
import { type IIcon, defaultValuesIcon, type TIconSize } from '../../../core'
import { Component, componentEmits, componentProps, syncComponent } from '../component'
import type { TEmits, TProps } from '../../common/types'

export const iconEmits: TEmits = [...componentEmits] as const

export const iconProps: TProps = {
	...componentProps,
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
	emits: iconEmits,
	props: iconProps,
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncIcon(props: TProps, instance: IIcon) {
	syncComponent(props, instance)

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
		}
	)
}

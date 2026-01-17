import { type PropType, watch } from 'vue'
import { type IIconProps, TIcon, type TComponentSize } from '../../../core'
import {
	ComponentView,
	emitsComponentView,
	propsComponentView,
	syncComponentView,
} from '../component-view'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../types/common'

export const emitsIcon: TEmits = [...emitsComponentView] as const

export const propsIcon: TProps = {
	...propsComponentView,
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
	extends: ComponentView,
	emits: emitsIcon,
	props: propsIcon,
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncIcon(options: ISyncComponentModelOptions<IIconProps>) {
	syncComponentView(options)

	const { instance, props } = options

	watch<TComponentSize | undefined>(
		() => props.size,
		(value) => {
			if (value !== undefined && value !== instance.size) {
				instance.size = value
			}
		},
	)

	watch<number | string | undefined>(
		() => props.width,
		(value) => {
			if (value !== undefined && value !== instance.width) {
				instance.width = value
			}
		},
	)

	watch<number | string | undefined>(
		() => props.height,
		(value) => {
			if (value !== undefined && value !== instance.height) {
				instance.height = value
			}
		},
	)
}

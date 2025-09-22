import { type PropType, watch } from 'vue'
import { type IButton, type TButtonAppearance, defaultButtonValues } from '../../../core'
import { type TVariant, TIcon } from '../../../core'
import { Control, controlEmits, controlProps, syncControl } from '../control'
import type { TEmits, TProps } from '../../common/types'
import { Icon } from '../icon'

export const buttonEmits: TEmits = [...controlEmits] as const

export const buttonProps: TProps = {
	...controlProps,
	tag: {
		type: [String, Object] as PropType<IButton['tag']>,
		default: defaultButtonValues.tag,
	},
	variant: {
		type: String as PropType<IButton['variant']>,
		default: defaultButtonValues.variant,
	},
	appearance: {
		type: String as PropType<IButton['appearance']>,
		default: defaultButtonValues.appearance,
	},
	icon: {
		type: Object as PropType<IButton['icon']>,
		default: defaultButtonValues.icon,
	},
}

console.log(buttonProps)

export default {
	name: 'BaseButton',
	extends: Control,
	components: { Icon },
	emits: buttonEmits,
	props: buttonProps,
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncButton(props: TProps, instance: IButton) {
	syncControl(props, instance)

	watch<TIcon | undefined>(
		() => props.icon,
		(value) => {
			if (value && value !== instance.icon) {
				instance.icon = value
			}
		},
		{ immediate: true },
	)

	watch<TVariant | undefined>(
		() => props.variant,
		(value) => {
			if (value && value !== instance.variant) {
				instance.variant = value
			}
		},
		{ immediate: true },
	)
	watch<TButtonAppearance | undefined>(
		() => props.appearance,
		(value) => {
			if (value && value !== instance.appearance) {
				instance.appearance = value
			}
		},
		{ immediate: true },
	)
}

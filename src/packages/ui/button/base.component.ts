import { type PropType, watch } from 'vue'
import { type IButton, type TButtonAppearance, defaultButtonValues } from '../../../core'
import { type TVariant } from '../../../core'
import { Control, controlEmits, controlProps, syncControl } from '../control'
import type { TEmits, TProps } from '../../common/types'

export const buttonEmits: TEmits = [...controlEmits] as const

export const buttonProps: TProps = {
	...controlProps,
	variant: {
		type: String as PropType<IButton['variant']>,
		default: defaultButtonValues.variant,
	},
	appearance: {
		type: String as PropType<IButton['appearance']>,
		default: defaultButtonValues.appearance,
	},
}

export default {
	name: 'BaseButton',
	extends: Control,
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

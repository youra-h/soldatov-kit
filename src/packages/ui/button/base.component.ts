import { type PropType } from 'vue'
import { type IButton, defaultButtonValues } from '../../../core/button'
import { BaseControl, controlEmits, controlProps } from '../control'
import type { TEmits, TProps } from '../../core/types'

export const buttonEmits: TEmits = [
	...controlEmits,
	'update:text',
	'update:disabled',
	'update:focused',
] as const

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
	extends: BaseControl,
	emits: buttonEmits,
	props: buttonProps,
}

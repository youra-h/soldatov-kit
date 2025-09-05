import { type PropType } from 'vue'
import { type IControl, defaultControlValues } from '../../../core/control'
import { BaseComponent, componentEmits, componentProps } from '../component'
import type { TEmits, TProps } from '../../core/types'

export const controlEmits: TEmits = [
	...componentEmits,
	'update:text',
	'update:disabled',
	'update:focused',
] as const

export const controlProps: TProps = {
	...componentProps,
	text: {
		type: String as PropType<IControl['text']>,
		default: defaultControlValues.text,
	},
	disabled: {
		type: Boolean as PropType<IControl['disabled']>,
		default: defaultControlValues.disabled,
	},
	focused: {
		type: Boolean as PropType<IControl['focused']>,
		default: defaultControlValues.focused,
	},
}

export default {
	name: 'BaseControl',
	extends: BaseComponent,
	emits: controlEmits,
	props: controlProps,
}

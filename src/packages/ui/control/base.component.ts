import { type PropType, watch } from 'vue'
import { type IControl, defaultControlValues } from '../../../core/control'
import { BaseComponent, componentEmits, componentProps, syncComponent } from '../component'
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

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncControl(props: TProps, instance: IControl) {
	syncComponent(props, instance)

	watch<boolean | undefined>(
		() => props.disabled,
		(value) => {
			if (value !== instance.disabled) {
				instance.disabled = value
			}
		},
	)

	watch<boolean | undefined>(
		() => props.focused,
		(value) => {
			if (value !== instance.focused) {
				instance.focused = value
			}
		},
	)

	watch<string>(
		() => props.text,
		(value) => {
			if (value !== instance.text) {
				instance.text = value
			}
		},
	)
}

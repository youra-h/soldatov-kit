import { type PropType, watch } from 'vue'
import { type IControl, type TComponentSize, defaultValuesControl } from '../../../core'
import { BaseComponent, componentEmits, componentProps, syncComponent } from '../component'
import type { TEmits, TProps } from '../../common/types'

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
		default: defaultValuesControl.text,
	},
	disabled: {
		type: Boolean as PropType<IControl['disabled']>,
		default: defaultValuesControl.disabled,
	},
	focused: {
		type: Boolean as PropType<IControl['focused']>,
		default: defaultValuesControl.focused,
	},
	size: {
		type: String as PropType<IControl['size']>,
		default: defaultValuesControl.size,
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

	watch<boolean>(
		() => props.disabled,
		(value) => {
			if (value !== instance.disabled) {
				instance.disabled = value
			}
		},
	)

	watch<boolean>(
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

	watch<TComponentSize | undefined>(
		() => props.size,
		(value) => {
			if (value && value !== instance.size) {
				instance.size = value
			}
		}
	)
}

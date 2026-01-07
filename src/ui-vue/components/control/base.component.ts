import { type PropType, watch } from 'vue'
import { type IControlProps, type TComponentSize, TControl } from '../../../core'
import { BaseComponent, emitsComponent, propsComponent, syncComponent } from '../component'
import type { TEmits, TProps, ISyncComponentOptions } from '../../types/types'

export const emitsControl: TEmits = [
	...emitsComponent,
	'update:text',
	'update:disabled',
	'update:focused',
	'changeText',
	'disabled',
	'focused',
] as const

export const propsControl: TProps = {
	...propsComponent,
	text: {
		type: String as PropType<IControlProps['text']>,
		default: TControl.defaultValues.text,
	},
	disabled: {
		type: Boolean as PropType<IControlProps['disabled']>,
		default: TControl.defaultValues.disabled,
	},
	focused: {
		type: Boolean as PropType<IControlProps['focused']>,
		default: TControl.defaultValues.focused,
	},
	size: {
		type: String as PropType<IControlProps['size']>,
		default: TControl.defaultValues.size,
	},
}

export default {
	name: 'BaseControl',
	extends: BaseComponent,
	emits: emitsControl,
	props: propsControl,
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncControl(options: ISyncComponentOptions<IControlProps>) {
	syncComponent(options)

	const { instance, props, emit } = options

	watch<boolean>(
		() => props.disabled,
		(value) => {
			if (value !== instance.disabled) {
				instance.disabled = value

				emit?.('disabled', value)
				emit?.('update:disabled', value)
			}
		},
	)

	watch<boolean>(
		() => props.focused,
		(value) => {
			if (value !== instance.focused) {
				instance.focused = value

				emit?.('focused', value)
				emit?.('update:focused', value)
			}
		},
	)

	watch<string>(
		() => props.text,
		(value) => {
			if (value !== instance.text) {
				instance.text = value

				emit?.('changeText', value)
				emit?.('update:text', value)
			}
		},
	)

	watch<TComponentSize | undefined>(
		() => props.size,
		(value) => {
			if (value && value !== instance.size) {
				instance.size = value
			}
		},
	)
}

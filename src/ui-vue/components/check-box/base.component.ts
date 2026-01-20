import { type PropType, watch } from 'vue'
import { type ICheckBoxProps, TCheckBox, TIcon } from '../../../core'
import {
	BaseInputControl,
	emitsInputControl,
	propsInputControl,
	syncInputControl,
} from '../input-control'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../types/common'
import { Icon } from '../icon'

export const emitsCheckBox: TEmits = [
	...emitsInputControl,
	'update:indeterminate',
	'changeIndeterminate',
] as const

export const propsCheckBox: TProps = {
	...propsInputControl,
	value: {
		type: [Boolean, Number] as PropType<ICheckBoxProps['value']>,
		default: TCheckBox.defaultValues.value,
	},
	indeterminate: {
		type: Boolean as PropType<ICheckBoxProps['indeterminate']>,
		default: TCheckBox.defaultValues.indeterminate,
	},
	plain: {
		type: Boolean as PropType<ICheckBoxProps['plain']>,
		default: TCheckBox.defaultValues.plain,
	},
	icon: {
		type: Object as PropType<ICheckBoxProps['icon']>,
		default: TCheckBox.defaultValues.icon,
	},
	indeterminateIcon: {
		type: Object as PropType<ICheckBoxProps['indeterminateIcon']>,
		default: TCheckBox.defaultValues.indeterminateIcon,
	},
}

export default {
	name: 'BaseCheckBox',
	extends: BaseInputControl,
	components: { Icon },
	emits: emitsCheckBox,
	props: propsCheckBox,
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncCheckBox(options: ISyncComponentModelOptions<ICheckBoxProps>): void {
	syncInputControl(options)

	const { instance, props, emit } = options

	watch<boolean | undefined>(
		() => props.indeterminate,
		(value) => {
			if (value !== undefined && value !== instance.indeterminate) {
				instance.indeterminate = value

				emit?.('update:indeterminate', value)
				emit?.('changeIndeterminate', value)
			}
		},
	)

	watch<boolean | undefined>(
		() => props.plain,
		(value) => {
			if (value !== undefined && value !== instance.plain) {
				instance.plain = value
			}
		},
	)

	watch<TIcon | undefined>(
		() => props.icon,
		(value) => {
			if (value !== instance.icon) {
				instance.icon = value
			}
		},
	)

	watch<TIcon | undefined>(
		() => props.indeterminateIcon,
		(value) => {
			if (value !== instance.indeterminateIcon) {
				instance.indeterminateIcon = value
			}
		},
	)
}

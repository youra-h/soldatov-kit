import { type PropType, watch } from 'vue'
import { type ICheckBoxProps, type ICheckBox, TCheckBox } from '../../../core'
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
export function syncCheckBox(options: ISyncComponentModelOptions<ICheckBoxProps, ICheckBox>): void {
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
}

import { type PropType, watch } from 'vue'
import { type ICheckBox, defaultCheckBoxValues } from '../../../core'
import { BaseControlValue, controlValueEmits, controlValueProps, syncControlValue } from '../control-value'
import type { TEmits, TProps } from '../../common/types'

export const checkBoxEmits: TEmits = [...controlValueEmits, 'update:value'] as const

export const checkBoxProps: TProps = {
	...controlValueProps,
	value: {
		type: String as PropType<ICheckBox['value']>,
		default: defaultCheckBoxValues.value,
	},
}

export default {
	name: 'BaseCheckBox',
	extends: BaseControlValue,
	emits: checkBoxEmits,
	props: checkBoxProps,
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncCheckBox(props: TProps, instance: ICheckBox): void {
	syncControlValue(props, instance)

	watch<any>(
		() => props.value,
		(value) => {
			if (value !== instance.value) {
				instance.value = value
			}
		},
	)
}

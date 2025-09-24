import { type PropType, watch } from 'vue'
import { type ICheckBox, defaultValuesCheckBox } from '../../../core'
import {
	BaseControlValue,
	emitsControlValue,
	propsControlValue,
	syncControlValue,
} from '../control-value'
import type { TEmits, TProps } from '../../common/types'

export const emitsCheckBox: TEmits = [...emitsControlValue, 'update:value'] as const

export const propsCheckBox: TProps = {
	...propsControlValue,
	value: {
		type: String as PropType<ICheckBox['value']>,
		default: defaultValuesCheckBox.value,
	},
}

export default {
	name: 'BaseCheckBox',
	extends: BaseControlValue,
	emits: emitsCheckBox,
	props: propsCheckBox,
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

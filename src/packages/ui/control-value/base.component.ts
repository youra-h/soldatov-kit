import { type PropType, watch } from 'vue'
import { type IControlValue, defaultValuesControlValue } from '../../../core'
import { BaseControl, controlEmits, controlProps, syncControl } from '../control'
import type { TEmits, TProps } from '../../common/types'

export const controlValueEmits: TEmits = [...controlEmits, 'update:value'] as const

export const controlValueProps: TProps = {
	...controlProps,
	value: {
		type: String as PropType<IControlValue['value']>,
		default: defaultValuesControlValue.value,
	},
}

export default {
	name: 'BaseControlValue',
	extends: BaseControl,
	emits: controlValueEmits,
	props: controlValueProps,
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncControlValue(props: TProps, instance: IControlValue): void {
	syncControl(props, instance)

	watch<any>(
		() => props.value,
		(value) => {
			if (value !== instance.value) {
				instance.value = value
			}
		},
	)
}

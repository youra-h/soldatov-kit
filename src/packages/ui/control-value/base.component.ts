import { type PropType, watch } from 'vue'
import { type IControlValue, defaultValuesControlValue } from '../../../core'
import { BaseControl, emitsControl, propsControl, syncControl } from '../control'
import type { TEmits, TProps } from '../../common/types'

export const emitsControlValue: TEmits = [...emitsControl, 'update:value'] as const

export const propsControlValue: TProps = {
	...propsControl,
	value: {
		type: String as PropType<IControlValue['value']>,
		default: defaultValuesControlValue.value,
	},
}

export default {
	name: 'BaseControlValue',
	extends: BaseControl,
	emits: emitsControlValue,
	props: propsControlValue,
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

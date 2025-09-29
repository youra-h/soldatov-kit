import { type PropType, watch } from 'vue'
import { type IControlValue, defaultValuesControlValue } from '../../../core'
import { BaseControl, emitsControl, propsControl, syncControl } from '../control'
import type { TEmits, TProps, ISyncComponentOptions } from '../../common/types'

export const emitsControlValue: TEmits = [...emitsControl, 'update:value', 'changeValue'] as const

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
export function syncControlValue(options: ISyncComponentOptions<IControlValue>): void {
	syncControl(options)

	const { instance, props, emit } = options

	watch<any>(
		() => props.value,
		(value) => {
			if (value !== instance.value) {
				instance.value = value

				emit?.('update:value', value)
				emit?.('changeValue', value)
			}
		},
	)
}

import { type PropType, watch } from 'vue'
import { type ISwitchProps, TSwitch, TIcon } from '../../../core'
import {
	BaseInputControl,
	emitsInputControl,
	propsInputControl,
	syncInputControl,
} from '../input-control'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../types/common'
import { Spinner } from '../spinner'

export const emitsSwitch: TEmits = [...emitsInputControl] as const

export const propsSwitch: TProps = {
	...propsInputControl,
	value: {
		type: [Boolean] as PropType<ISwitchProps['value']>,
		default: TSwitch.defaultValues.value,
	},
}

export default {
	name: 'BaseSwitch',
	extends: BaseInputControl,
	components: { Spinner },
	emits: emitsSwitch,
	props: propsSwitch,
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncSwitch(options: ISyncComponentModelOptions<ISwitchProps>): void {
	syncInputControl(options)
}

import { type PropType } from 'vue'
import { type ISwitch, type ISwitchProps, TSwitch } from '../../../core'
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
export function syncSwitch(options: ISyncComponentModelOptions<ISwitchProps, ISwitch>): void {
	syncInputControl(options)
}

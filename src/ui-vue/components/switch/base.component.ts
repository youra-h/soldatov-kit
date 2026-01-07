import { type PropType, watch } from 'vue'
import { type ISwitchProps, TSwitch, TIcon } from '../../../core'
import {
	BaseControlInput,
	emitsControlInput,
	propsControlInput,
	syncControlInput,
} from '../control-input'
import type { TEmits, TProps, ISyncComponentOptions } from '../../types/common'
import { Icon } from '../icon'
import { Spinner } from '../spinner'

export const emitsSwitch: TEmits = [...emitsControlInput] as const

export const propsSwitch: TProps = {
	...propsControlInput,
	value: {
		type: [Boolean] as PropType<ISwitchProps['value']>,
		default: TSwitch.defaultValues.value,
	},
	icon: {
		type: Object as PropType<ISwitchProps['icon']>,
		default: TSwitch.defaultValues.icon,
	},
}

export default {
	name: 'BaseSwitch',
	extends: BaseControlInput,
	components: { Icon, Spinner },
	emits: emitsSwitch,
	props: propsSwitch,
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncSwitch(options: ISyncComponentOptions<ISwitchProps>): void {
	syncControlInput(options)

	const { instance, props } = options

	watch<TIcon | undefined>(
		() => props.icon,
		(value) => {
			if (value !== instance.icon) {
				instance.icon = value
			}
		},
	)
}

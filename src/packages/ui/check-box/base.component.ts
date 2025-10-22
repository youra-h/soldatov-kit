import { type PropType, watch } from 'vue'
import { type ICheckBox, TCheckBox, TIcon } from '../../../core'
import {
	BaseControlInput,
	emitsControlInput,
	propsControlInput,
	syncControlInput,
} from '../control-input'
import type { TEmits, TProps, ISyncComponentOptions } from '../../common/types'
import { Icon } from '../icon'

export const emitsCheckBox: TEmits = [
	...emitsControlInput,
	'update:indeterminate',
	'changeIndeterminate',
] as const

export const propsCheckBox: TProps = {
	...propsControlInput,
	value: {
		type: [Boolean, Number] as PropType<ICheckBox['value']>,
		default: TCheckBox.defaultValues.value,
	},
	indeterminate: {
		type: Boolean as PropType<ICheckBox['indeterminate']>,
		default: TCheckBox.defaultValues.indeterminate,
	},
	plain: {
		type: Boolean as PropType<ICheckBox['plain']>,
		default: TCheckBox.defaultValues.plain,
	},
	icon: {
		type: Object as PropType<ICheckBox['icon']>,
		default: TCheckBox.defaultValues.icon,
	},
	indeterminateIcon: {
		type: Object as PropType<ICheckBox['indeterminateIcon']>,
		default: TCheckBox.defaultValues.indeterminateIcon,
	},
}

export default {
	name: 'BaseCheckBox',
	extends: BaseControlInput,
	components: { Icon },
	emits: emitsCheckBox,
	props: propsCheckBox,
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncCheckBox(options: ISyncComponentOptions<ICheckBox>): void {
	syncControlInput(options)

	const { instance, props, emit } = options

	watch<boolean>(
		() => props.indeterminate,
		(value) => {
			if (value !== instance.indeterminate) {
				instance.indeterminate = value

				emit?.('update:indeterminate', value)
				emit?.('changeIndeterminate', value)
			}
		},
	)

	watch<boolean>(
		() => props.plain,
		(value) => {
			if (value !== instance.plain) {
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

import { type PropType, watch } from 'vue'
import { type ICheckBox, defaultValuesCheckBox, type TComponentVariant, TIcon } from '../../../core'
import {
	BaseControlValue,
	emitsControlValue,
	propsControlValue,
	syncControlValue,
} from '../control-value'
import type { TEmits, TProps, ISyncComponentOptions } from '../../common/types'

export const emitsCheckBox: TEmits = [
	...emitsControlValue,
	'update:indeterminate',
	'changeIndeterminate',
] as const

export const propsCheckBox: TProps = {
	...propsControlValue,
	indeterminate: {
		type: Boolean as PropType<ICheckBox['indeterminate']>,
		default: defaultValuesCheckBox.indeterminate,
	},
	plain: {
		type: Boolean as PropType<ICheckBox['plain']>,
		default: defaultValuesCheckBox.plain,
	},
	variant: {
		type: String as PropType<ICheckBox['variant']>,
		default: defaultValuesCheckBox.variant,
	},
	icon: {
		type: Object as PropType<ICheckBox['icon']>,
		default: defaultValuesCheckBox.icon,
	},
	indeterminateIcon: {
		type: Object as PropType<ICheckBox['indeterminateIcon']>,
		default: defaultValuesCheckBox.indeterminateIcon,
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
export function syncCheckBox(options: ISyncComponentOptions<ICheckBox>): void {
	syncControlValue(options)

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

	watch<TComponentVariant>(
		() => props.variant,
		(value) => {
			if (value !== instance.variant) {
				instance.variant = value
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

import { type PropType, watch } from 'vue'
import { type IButton, type TButtonAppearance, TSpinner, defaultValuesButton } from '../../../core'
import { type TComponentVariant, TIcon } from '../../../core'
import { Control, controlEmits, controlProps, syncControl } from '../control'
import type { TEmits, TProps } from '../../common/types'
import { Icon } from '../icon'
import { Spinner } from '../spinner'

export const buttonEmits: TEmits = [...controlEmits] as const

export const buttonProps: TProps = {
	...controlProps,
	tag: {
		type: [String, Object] as PropType<IButton['tag']>,
		default: defaultValuesButton.tag,
	},
	variant: {
		type: String as PropType<IButton['variant']>,
		default: defaultValuesButton.variant,
	},
	appearance: {
		type: String as PropType<IButton['appearance']>,
		default: defaultValuesButton.appearance,
	},
	icon: {
		type: Object as PropType<IButton['icon']>,
		default: defaultValuesButton.icon,
	},
	loading: {
		type: Boolean as PropType<IButton['loading']>,
		default: defaultValuesButton.loading,
	},
	spinner: {
		type: Object as PropType<IButton['spinner']>,
		default: defaultValuesButton.spinner,
	},
}

export default {
	name: 'BaseButton',
	extends: Control,
	components: { Icon, Spinner },
	emits: buttonEmits,
	props: buttonProps,
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncButton(props: TProps, instance: IButton) {
	syncControl(props, instance)

	watch<TIcon | undefined>(
		() => props.icon,
		(value) => {
			if (value && value !== instance.icon) {
				instance.icon = value
			}
		}
	)

	watch<TComponentVariant>(
		() => props.variant,
		(value) => {
			if (value && value !== instance.variant) {
				instance.variant = value
			}
		},
	)

	watch<TButtonAppearance>(
		() => props.appearance,
		(value) => {
			if (value && value !== instance.appearance) {
				instance.appearance = value
			}
		},
	)

	watch<TSpinner | undefined>(
		() => props.spinner,
		(value) => {
			if (value && value !== instance.spinner) {
				instance.spinner = value
			}
		},
	)

	watch<boolean>(
		() => props.loading,
		(value) => {
			if (value !== instance.loading) {
				instance.loading = value
			}
		},
	)
}

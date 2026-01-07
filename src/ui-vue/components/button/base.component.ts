import { type PropType, watch } from 'vue'
import {
	type TComponentVariant,
	TIcon,
	type IButtonProps,
	type TButtonAppearance,
	TSpinner,
	TButton,
} from '../../../core'
import { Control, emitsControl, propsControl, syncControl } from '../control'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../types'
import { Icon } from '../icon'
import { Spinner } from '../spinner'

export const emitsButton: TEmits = [...emitsControl] as const

export const propsButton: TProps = {
	...propsControl,
	tag: {
		type: [String, Object] as PropType<IButtonProps['tag']>,
		default: TButton.defaultValues.tag,
	},
	variant: {
		type: String as PropType<IButtonProps['variant']>,
		default: TButton.defaultValues.variant,
	},
	appearance: {
		type: String as PropType<IButtonProps['appearance']>,
		default: TButton.defaultValues.appearance,
	},
	icon: {
		type: Object as PropType<IButtonProps['icon']>,
		default: TButton.defaultValues.icon,
	},
	loading: {
		type: Boolean as PropType<IButtonProps['loading']>,
		default: TButton.defaultValues.loading,
	},
	spinner: {
		type: Object as PropType<IButtonProps['spinner']>,
		default: TButton.defaultValues.spinner,
	},
}

export default {
	name: 'BaseButton',
	extends: Control,
	components: { Icon, Spinner },
	emits: emitsButton,
	props: propsButton,
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncButton(options: ISyncComponentModelOptions<IButtonProps>) {
	syncControl(options)

	const { instance, props } = options

	watch<TIcon | undefined>(
		() => props.icon,
		(value) => {
			if (value && value !== instance.icon) {
				instance.icon = value
			}
		},
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

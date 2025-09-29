import { type PropType, watch } from 'vue'
import {
	type TComponentVariant,
	TIcon,
	type IButton,
	type TButtonAppearance,
	TSpinner,
	defaultValuesButton,
} from '../../../core'
import { Control, emitsControl, propsControl, syncControl } from '../control'
import type { TEmits, TProps, ISyncComponentOptions } from '../../common/types'
import { Icon } from '../icon'
import { Spinner } from '../spinner'

export const emitsButton: TEmits = [...emitsControl] as const

export const propsButton: TProps = {
	...propsControl,
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
	emits: emitsButton,
	props: propsButton,
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncButton(options: ISyncComponentOptions<IButton>) {
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

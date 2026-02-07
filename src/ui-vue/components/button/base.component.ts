import { type PropType, watch } from 'vue'
import {
	type IButtonProps,
	type TButtonAppearance,
	TButton,
	type IButton,
} from '../../../core'
import { BaseTextable, emitsTextable, propsTextable, syncTextable } from '../textable'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../types'
import { Spinner } from '../spinner'

export const emitsButton: TEmits = [...emitsTextable, 'change:loading', 'update:loading'] as const

export const propsButton: TProps = {
	...propsTextable,
	appearance: {
		type: String as PropType<IButtonProps['appearance']>,
		default: TButton.defaultValues.appearance,
	},
	loading: {
		type: Boolean as PropType<IButtonProps['loading']>,
		default: TButton.defaultValues.loading,
	},
	loadingShouldDisable: {
		type: Boolean,
		default: true,
	},
}

export default {
	name: 'BaseButton',
	extends: BaseTextable,
	components: { Spinner },
	emits: emitsButton,
	props: propsButton,
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncButton(
	options: ISyncComponentModelOptions<IButtonProps, IButton> & {
		props: { loadingShouldDisable?: boolean }
	},
) {
	syncTextable(options)

	const { instance, props, emit } = options

	// Синхронизируем loadingShouldDisable с behavior
	if (props.loadingShouldDisable !== undefined) {
		instance.loadingState.behavior.shouldDisable = props.loadingShouldDisable
	}

	// Пробрасываем событие loading
	instance.events.on('change:loading', (value: boolean) => {
		emit?.('change:loading', value)
		emit?.('update:loading', value)
	})

	watch<TButtonAppearance | undefined>(
		() => props.appearance,
		(value) => {
			if (value !== undefined && value !== instance.appearance) {
				instance.appearance = value
			}
		},
	)

	watch<boolean | undefined>(
		() => props.loading,
		(value) => {
			if (value !== undefined && value !== instance.loading) {
				instance.loading = value
			}
		},
	)

	watch(
		() => props.loadingShouldDisable,
		(value) => {
			if (value !== undefined) {
				instance.loadingState.behavior.shouldDisable = value
			}
		},
	)
}

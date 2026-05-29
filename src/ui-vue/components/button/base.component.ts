import { type PropType, watch, type Ref } from 'vue'
import {
	type IButtonProps,
	type TButtonAppearance,
	TButton,
	type IButton,
} from '@core'
import { BaseTextable, emitsTextable, propsTextable, syncTextable, type ITextableState } from '../textable'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../types'
import { Spinner } from '../spinner'
import { useSyncProps } from '../../composables/useSyncProps'

export const emitsButton: TEmits = [
	...emitsTextable,
	'change:appearance',
	'update:appearance',
	'appearance',
	'change:loading',
	'update:loading',
	'loading'
] as const

export const propsButton: TProps = {
	...propsTextable,
	tag: {
		type: [Object, String] as PropType<IButtonProps['tag']>,
		default: TButton.defaultValues.tag,
	},
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

export interface IButtonState extends ITextableState {
	appearance: Ref<TButtonAppearance>
	loading: Ref<boolean>
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
): IButtonState {
	const syncProps = syncTextable(options)

	const { instance, props, emit } = options

	// Синхронизируем loadingShouldDisable с behavior
	if (props.loadingShouldDisable !== undefined) {
		instance.loadingState.behavior.shouldDisable = props.loadingShouldDisable
	}

	// Пробрасываем событие loading
	instance.events.on('change:loading', (value: boolean) => {
		emit?.('change:loading', value)
		emit?.('loading', value)
		emit?.('update:loading', value)
	})

	// Пробрасываем событие appearance
	instance.events.on('change:appearance' as any, (value: TButtonAppearance) => {
		emit?.('change:appearance', value)
		emit?.('appearance', value)
		emit?.('update:appearance', value)
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

	return {
		...syncProps,
		...useSyncProps(instance.events as any, {
			appearance: () => instance.appearance,
			loading: () => instance.loading,
		}),
	}
}

import { type PropType, watch, type Ref } from 'vue'
import { type IButtonProps, type TButtonAppearance, TButton, type IButton } from '@core'
import {
	BaseTextable,
	emitsTextable,
	propsTextable,
	syncTextable,
	type ITextableState,
} from '../textable'
import type { TEmits, TProps, ISyncComponentViewOptions } from '../../types'
import { useSyncProps } from '../../composables/useSyncProps'

export const emitsButton: TEmits = [
	...emitsTextable,
	'change:appearance',
	'update:appearance',
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
}

export default {
	name: 'BaseButton',
	extends: BaseTextable,
	emits: emitsButton,
	props: propsButton,
}

export interface IButtonState extends ITextableState {
	appearance: Ref<TButtonAppearance>
}

export function syncButton(
	options: ISyncComponentViewOptions<IButtonProps, IButton>,
): IButtonState {
	const syncProps = syncTextable(options)

	const { instance, props, emit } = options

	instance.events.on('change:appearance' as any, (value: TButtonAppearance) => {
		emit?.('change:appearance', value)
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

	return {
		...syncProps,
		...useSyncProps(instance.events as any, {
			appearance: () => instance.appearance,
		}),
	}
}

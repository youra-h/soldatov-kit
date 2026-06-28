import { type PropType, watch, type Ref } from 'vue'
import { type IButtonProps, type TButtonView, TButton, type IButton } from '@core'
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
	'change:view',
	'update:view',
] as const

export const propsButton: TProps = {
	...propsTextable,
	tag: {
		type: [Object, String] as PropType<IButtonProps['tag']>,
		default: TButton.defaultValues.tag,
	},
	view: {
		type: String as PropType<IButtonProps['view']>,
		default: TButton.defaultValues.view,
	},
}

export default {
	name: 'BaseButton',
	extends: BaseTextable,
	emits: emitsButton,
	props: propsButton,
}

export interface IButtonState extends ITextableState {
	view: Ref<TButtonView>
}

export function syncButton(
	options: ISyncComponentViewOptions<IButtonProps, IButton>,
): IButtonState {
	const syncProps = syncTextable(options)

	const { instance, props, emit } = options

	instance.events.on('change:view' as any, (value: TButtonView) => {
		emit?.('change:view', value)
		emit?.('update:view', value)
	})

	watch<TButtonView | undefined>(
		() => props.view,
		(value) => {
			if (value !== undefined && value !== instance.view) {
				instance.view = value
			}
		},
	)

	return {
		...syncProps,
		...useSyncProps(instance.events as any, {
			view: () => instance.view,
		}),
	}
}

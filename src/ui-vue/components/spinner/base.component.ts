import { type PropType, watch, type Ref } from 'vue'
import {
	type ISpinnerProps,
	TSpinner,
	type ISpinner,
} from '@core'
import {
	BaseStylable,
	emitsStylable,
	propsStylable,
	syncStylable,
	type IStylableState,
} from '../stylable'
import type { TEmits, TProps, ISyncComponentViewOptions } from '../../types/common'
import { useSyncProps } from '../../composables/useSyncProps'

export const emitsSpinner: TEmits = [
	...emitsStylable,
	'change:borderWidth',
	'update:borderWidth',
] as const

export const propsSpinner: TProps = {
	...propsStylable,
	tag: {
		type: [Object, String] as PropType<ISpinnerProps['tag']>,
		default: TSpinner.defaultValues.tag,
	},
	borderWidth: {
		type: [String, Number] as PropType<ISpinnerProps['borderWidth']>,
		default: TSpinner.defaultValues.borderWidth,
	},
}

export default {
	name: 'BaseSpinner',
	extends: BaseStylable,
	emits: emitsSpinner,
	props: propsSpinner,
}

export interface ISpinnerState extends IStylableState {
	borderWidth: Ref<number | 'auto'>
}

/**
 * Bind props to instance properties.
 */
export function syncSpinner(
	options: ISyncComponentViewOptions<ISpinnerProps, ISpinner>,
): ISpinnerState {
	const syncProps = syncStylable(options)

	const { instance, props, emit } = options

	instance.events.on('change:borderWidth', (value: number | 'auto') => {
		emit?.('change:borderWidth', value)
		emit?.('update:borderWidth', value)
	})

	watch<'auto' | number | undefined>(
		() => props.borderWidth,
		(value) => {
			if (value !== undefined && value !== instance.borderWidth) {
				instance.borderWidth = value
			}
		},
	)

	return {
		...syncProps,
		...useSyncProps(instance.events as any, {
			borderWidth: () => instance.borderWidth,
		}),
	}
}

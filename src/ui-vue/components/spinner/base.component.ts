import { type PropType, watch, type Ref } from 'vue'
import {
	type ISpinnerProps,
	TSpinner,
	type TComponentSize,
	type TComponentVariant,
	type ISpinner,
} from '@core'
import {
	ComponentView,
	emitsComponentView,
	propsComponentView,
	syncComponentView,
	type IComponentViewState,
} from '../component-view'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../types/common'
import { useSyncProps } from '../../composables/useSyncProps'

export const emitsSpinner: TEmits = [...emitsComponentView] as const

export const propsSpinner: TProps = {
	...propsComponentView,
	tag: {
		type: [Object, String] as PropType<ISpinnerProps['tag']>,
		default: TSpinner.defaultValues.tag,
	},
	variant: {
		type: String as PropType<ISpinnerProps['variant']>,
		default: TSpinner.defaultValues.variant,
	},
	size: {
		type: String as PropType<ISpinnerProps['size']>,
		default: TSpinner.defaultValues.size,
	},
	borderWidth: {
		type: [String, Number] as PropType<ISpinnerProps['borderWidth']>,
		default: TSpinner.defaultValues.borderWidth,
	},
}

export default {
	name: 'BaseSpinner',
	extends: ComponentView,
	emits: emitsSpinner,
	props: propsSpinner,
}

export interface ISpinnerState extends IComponentViewState {
	size: Ref<TComponentSize>
	variant: Ref<TComponentVariant>
	borderWidth: Ref<number | 'auto'>
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncSpinner(options: ISyncComponentModelOptions<ISpinnerProps, ISpinner>): ISpinnerState {
	const syncProps = syncComponentView(options)

	const { instance, props } = options

	watch<TComponentVariant | undefined>(
		() => props.variant,
		(value) => {
			if (value !== undefined && value !== instance.variant) {
				instance.variant = value
			}
		},
	)

	watch<TComponentSize | undefined>(
		() => props.size,
		(value) => {
			if (value !== undefined && value !== instance.size) {
				instance.size = value
			}
		},
	)

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
			variant: () => instance.variant,
			size: () => instance.size,
			borderWidth: () => instance.borderWidth,
		}),
	}
}

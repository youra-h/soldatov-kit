import { type PropType, watch, type Ref } from 'vue'
import { type IIconProps, TIcon, type TComponentSize, type IIcon } from '@core'
import {
	ComponentView,
	emitsComponentView,
	propsComponentView,
	syncComponentView,
	type IComponentViewState,
} from '../component-view'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../types/common'
import { useSyncProps } from '../../composables/useSyncProps'

export const emitsIcon: TEmits = [
	...emitsComponentView,
	'change:size',
	'update:size',
	'size',
	'change:width',
	'update:width',
	'width',
	'change:height',
	'update:height',
	'height',
] as const

export const propsIcon: TProps = {
	...propsComponentView,
	tag: {
		type: [String, Object] as PropType<IIconProps['tag']>,
		default: TIcon.defaultValues.tag,
	},
	size: {
		type: String as PropType<IIconProps['size']>,
		default: TIcon.defaultValues.size,
	},
	width: {
		type: [Number, String] as PropType<IIconProps['width']>,
		default: TIcon.defaultValues.width,
	},
	height: {
		type: [Number, String] as PropType<IIconProps['height']>,
		default: TIcon.defaultValues.height,
	},
}

export default {
	name: 'BaseIcon',
	extends: ComponentView,
	emits: emitsIcon,
	props: propsIcon,
}

export interface IIconState extends IComponentViewState {
	size: Ref<TComponentSize>
	width: Ref<string | number | undefined>
	height: Ref<string | number | undefined>
}

/**
 * Bind props to instance properties.
 * @param props
 * @param instance
 */
export function syncIcon(options: ISyncComponentModelOptions<IIconProps, IIcon>): IIconState {
	const syncProps = syncComponentView(options)

	const { instance, props, emit } = options

	// Пробрасываем события core-инстанса наружу (Vue events).
	instance.events.on('change:size' as any, (value: TComponentSize) => {
		emit?.('change:size', value)
		emit?.('size', value)
		emit?.('update:size', value)
	})

	instance.events.on('change:width' as any, (value: string | number | undefined) => {
		emit?.('change:width', value)
		emit?.('width', value)
		emit?.('update:width', value)
	})

	instance.events.on('change:height' as any, (value: string | number | undefined) => {
		emit?.('change:height', value)
		emit?.('height', value)
		emit?.('update:height', value)
	})

	watch<TComponentSize | undefined>(
		() => props.size,
		(value) => {
			if (value !== undefined && value !== instance.size) {
				instance.size = value
			}
		},
	)

	watch<number | string | undefined>(
		() => props.width,
		(value) => {
			if (value !== undefined && value !== instance.width) {
				instance.width = value
			}
		},
	)

	watch<number | string | undefined>(
		() => props.height,
		(value) => {
			if (value !== undefined && value !== instance.height) {
				instance.height = value
			}
		},
	)

	return {
		...syncProps,
		...useSyncProps(instance.events as any, {
			size: () => instance.size,
			width: () => instance.width,
			height: () => instance.height,
		}),
	}
}

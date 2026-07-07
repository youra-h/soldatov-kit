import type { PropType, Ref } from 'vue'
import { type IFrameProps, TFrame, type IFrame, type TFrameStrategy } from '@core'
import { useSyncProps } from '../../composables/useSyncProps'
import { useInheritProps } from '../../composables/useInheritProps'
import {
	BaseComponent,
	emitsComponent,
	propsComponent,
	type TBaseComponentProps,
} from '../component'
import type { TEmits, TProps, ISyncComponentViewOptions } from '../../types'
import { TFrameStylePlugin } from '@plugins'

export const emitsFrame: TEmits = [
	...emitsComponent,
	'change:visible',
	'update:visible',
	'change:x',
	'update:x',
	'change:y',
	'update:y',
	'change:width',
	'update:width',
	'change:height',
	'update:height',
	'change:zIndex',
	'change:strategy',
	'update:strategy',
	'beforeShow',
	'beforeHide',
	'show',
	'hide',
] as const

export const propsFrame: TProps = {
	...useInheritProps(propsComponent, TFrame),
	x: {
		type: Number as PropType<IFrameProps['x']>,
		default: TFrame.defaultValues.x,
	},
	y: {
		type: Number as PropType<IFrameProps['y']>,
		default: TFrame.defaultValues.y,
	},
	width: {
		type: [Number, String] as PropType<IFrameProps['width']>,
		default: TFrame.defaultValues.width,
	},
	height: {
		type: [Number, String] as PropType<IFrameProps['height']>,
		default: TFrame.defaultValues.height,
	},
	visible: {
		type: Boolean as PropType<IFrameProps['visible']>,
		default: TFrame.defaultValues.visible,
	},
	strategy: {
		type: String as PropType<IFrameProps['strategy']>,
		default: TFrame.defaultValues.strategy,
	},
}

export default {
	name: 'BaseFrame',
	extends: BaseComponent,
	emits: emitsFrame,
	props: propsFrame,
}

export interface IFrameState {
	visible: Ref<boolean>
	x: Ref<number>
	y: Ref<number>
	styles: Ref<Record<string, string | number>>
	width: Ref<string | number | undefined>
	height: Ref<string | number | undefined>
	strategy: Ref<TFrameStrategy>
}

/**
 * Bind props to instance properties.
 * @param options - sync options
 */
export function syncFrame(
	options: ISyncComponentViewOptions<IFrameProps, IFrame>,
): IFrameState {
	const { instance, emit, plugins } = options

	// Пробрасываем события core-инстанса наружу (Vue events)
	instance.events.on('beforeShow' as any, () => {
		emit?.('beforeShow')
	})
	instance.events.on('beforeHide' as any, () => {
		emit?.('beforeHide')
	})
	instance.events.on('show' as any, () => {
		emit?.('show', instance)
	})
	instance.events.on('hide' as any, () => {
		emit?.('hide', instance)
	})
	instance.events.on('change:visible' as any, (value: boolean) => {
		emit?.('change:visible', value)
		emit?.('update:visible', value)
	})
	instance.events.on('change:x' as any, (value: number) => {
		emit?.('change:x', value)
		emit?.('update:x', value)
	})
	instance.events.on('change:y' as any, (value: number) => {
		emit?.('change:y', value)
		emit?.('update:y', value)
	})
	instance.events.on('change:width' as any, (value: number | string) => {
		emit?.('change:width', value)
		emit?.('update:width', value)
	})
	instance.events.on('change:height' as any, (value: number | string) => {
		emit?.('change:height', value)
		emit?.('update:height', value)
	})
	instance.events.on('change:zIndex' as any, (value: number) => {
		emit?.('change:zIndex', value)
	})
	instance.events.on('change:strategy' as any, (value: TFrameStrategy) => {
		emit?.('change:strategy', value)
		emit?.('update:strategy', value)
	})

	const stylePlugin = plugins.get(TFrameStylePlugin)!

	return {
		...useSyncProps(instance.events as any, {
			visible: () => instance.visible,
			x: () => instance.x,
			y: () => instance.y,
			width: () => instance.width,
			height: () => instance.height,
			strategy: () => instance.strategy,
		}),
		...useSyncProps(stylePlugin.events as any, {
			styles: () => stylePlugin.styles,
		}),
	}
}

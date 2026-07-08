import type { PropType, Ref } from 'vue'
import { type IFrameProps, TFrame, type IFrame, type TFramePosition } from '@core'
import { useSyncProps } from '../../composables/useSyncProps'
import { useInheritProps } from '../../composables/useInheritProps'
import {
	BaseComponent,
	emitsComponent,
	propsComponent,
	syncComponent,
	type IComponentState,
} from '../component'
import type { TEmits, TProps, ISyncComponentOptions } from '../../types'
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
	'change:position',
	'update:position',
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
	position: {
		type: String as PropType<IFrameProps['position']>,
		default: TFrame.defaultValues.position,
	},
}

export default {
	name: 'BaseFrame',
	extends: BaseComponent,
	emits: emitsFrame,
	props: propsFrame,
}

export interface IFrameState extends IComponentState {
	x: Ref<number>
	y: Ref<number>
	styles: Ref<Record<string, string | number>>
	width: Ref<string | number | undefined>
	height: Ref<string | number | undefined>
	position: Ref<TFramePosition>
	target: Ref<string>
}

/**
 * Bind props to instance properties.
 * @param options - sync options
 */
export function syncFrame(
	options: ISyncComponentOptions<IFrameProps, IFrame>,
): IFrameState {
	const syncProps = syncComponent(options)

	const { instance, emit, plugins } = options

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
	instance.events.on('change:position' as any, (value: TFramePosition) => {
		emit?.('change:position', value)
		emit?.('update:position', value)
	})
	instance.events.on('change:target' as any, (value: string) => {
		emit?.('change:target', value)
		emit?.('update:target', value)
	})

	const stylePlugin = plugins.get(TFrameStylePlugin)!

	return {
		...syncProps,
		...useSyncProps(instance.events as any, {
			x: () => instance.x,
			y: () => instance.y,
			width: () => instance.width,
			height: () => instance.height,
			position: () => instance.position,
			target: () => instance.target,
		}),
		...useSyncProps(stylePlugin.events as any, {
			styles: () => stylePlugin.styles,
		}),
	}
}

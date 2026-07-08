import type { PropType, Ref } from 'vue'
import { watch } from 'vue'
import { useSyncProps } from '../../composables/useSyncProps'
import { type IComponentView, type IComponentViewProps, TComponentView } from '@core'
import type { TEmits, TProps, ISyncComponentOptions } from '../../types'
import { type IPluginBundle, TElementPlugin } from '@plugins'
import {
	BaseComponent,
	emitsComponent,
	propsComponent,
	syncComponent,
	type IComponentState
} from '../component'
import { useInheritProps } from '../../composables/useInheritProps'

export const emitsComponentView: TEmits = [
	...emitsComponent,
	'rendered',
	'update:rendered',
	'change:rendered',
	'visible',
	'update:visible',
	'change:visible',
	'hide',
	'show',
	'beforeShow',
	'afterShow',
	'beforeHide',
	'afterHide',
	'ready',
] as const

export const propsComponentView: TProps = {
	...useInheritProps(propsComponent, TComponentView),
	plugins: {
		type: Object as PropType<IPluginBundle>,
	},
	tag: {
		type: [Object, String] as PropType<IComponentViewProps['tag']>,
		default: TComponentView.defaultValues.tag,
	},
	rendered: {
		type: Boolean as PropType<IComponentViewProps['rendered']>,
		default: TComponentView.defaultValues.rendered,
	},
	visible: {
		type: Boolean as PropType<IComponentViewProps['visible']>,
		default: TComponentView.defaultValues.visible,
	},
}

export default {
	name: 'BaseComponentView',
	extends: BaseComponent,
	emits: emitsComponentView,
	props: propsComponentView,
}

export interface IComponentViewState extends IComponentState {
	tag: Ref<string | object>
	classes: Ref<string[]>
}

export function syncComponentView(
	options: ISyncComponentOptions<IComponentViewProps, IComponentView>,
): IComponentViewState {
	const syncProps = syncComponent(options)

	const { props, instance, plugins, emit } = options

	plugins.get(TElementPlugin)!.events.on('ready', ({ element }: { element: HTMLElement }) => {
		const payload = { element, instance, plugins }
		emit?.('ready', payload)
	})

	watch<Object | string | undefined>(
		() => props.tag,
		(value) => {
			if (value !== undefined && value !== instance.tag) {
				instance.tag = value
			}
		},
	)

	return {
		...syncProps,
		...useSyncProps(instance.events, {
			rendered: () => instance.rendered,
			visible: () => instance.visible,
			present: () => instance.present,
			tag: () => instance.tag,
			classes: () => instance.classes.list,
		})
	}
}

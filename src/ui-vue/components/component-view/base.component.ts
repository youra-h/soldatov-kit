import type { PropType, Ref } from 'vue'
import { watch } from 'vue'
import { useSyncProps } from '../../composables/useSyncProps'
import { type IComponentViewProps, TComponentView } from '@core'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../types'
import { type IPluginBundle, TElementPlugin } from '@plugins'
import {
	BaseComponentModel,
	emitsComponentModel,
	propsComponentModel,
} from '../component-model'

export const emitsComponentView: TEmits = [
	...emitsComponentModel,
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
	...propsComponentModel,
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
	extends: BaseComponentModel,
	emits: emitsComponentView,
	props: propsComponentView,
}

export interface IComponentViewState {
	rendered: Ref<boolean>
	visible: Ref<boolean>
	tag: Ref<string | object>
	classes: Ref<string[]>
}

export function syncComponentView(
	options: ISyncComponentModelOptions<IComponentViewProps>,
): IComponentViewState {
	const { props, instance, plugins, emit } = options

	// Пробрасываем события core-инстанса наружу (Vue events).
	// instance.events.on('created' as any, (instance: IComponentView) => {
	// 	emit?.('created', instance)
	// })

	instance.events.on('beforeShow' as any, () => {
		emit?.('beforeShow')
	})
	instance.events.on('afterShow' as any, () => {
		emit?.('afterShow')
	})
	instance.events.on('beforeHide' as any, () => {
		emit?.('beforeHide')
	})
	instance.events.on('afterHide' as any, () => {
		emit?.('afterHide')
	})
	instance.events.on('show' as any, () => {
		emit?.('show', instance)
	})
	instance.events.on('hide' as any, () => {
		emit?.('hide', instance)
	})
	instance.events.on('change:visible' as any, (value: boolean) => {
		emit?.('change:visible', value)
		emit?.('visible', value)
		emit?.('update:visible', value)
	})
	instance.events.on('change:rendered' as any, (value: boolean) => {
		emit?.('change:rendered', value)
		emit?.('rendered', value)
		emit?.('update:rendered', value)
	})

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

	watch<boolean | undefined>(
		() => props.rendered,
		(value) => {
			if (value !== undefined && value !== instance.rendered) {
				instance.rendered = value
			}
		},
	)

	watch<boolean | undefined>(
		() => props.visible,
		(value) => {
			if (value !== undefined && value !== instance.visible) {
				instance.visible = value
			}
		},
	)

	return useSyncProps(instance.events, {
		rendered: () => instance.rendered,
		visible: () => instance.visible,
		tag: () => instance.tag,
		classes: () => instance.classes.list,
	})
}

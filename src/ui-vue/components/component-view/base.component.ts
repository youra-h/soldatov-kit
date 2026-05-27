import type { PropType, Ref, UnwrapNestedRefs } from 'vue'
import { watch } from 'vue'
import { useEventRef } from '../../composables/useEventRef'
import { type IComponentView, type IComponentViewProps, TComponentView } from '@core'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../types'
import { type IPluginBundle, TElementPlugin } from '@plugins'

export const emitsComponentView: TEmits = [
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
	'created',
	'ready',
] as const

export const propsComponentView: TProps = {
	ctrl: {
		type: Object as PropType<IComponentView | UnwrapNestedRefs<IComponentView>>,
	},
	plugins: {
		type: Object as PropType<IPluginBundle>,
	},
	id: {
		type: [String, Number] as PropType<IComponentViewProps['id']>,
		default: TComponentView.defaultValues.id,
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
	emits: emitsComponentView,
	props: propsComponentView,
	created() {
		// @ts-ignore
		;(this.instance! as IComponentView).id = this.$.uid
		// Emit 'created' event when component is created
		// @ts-ignore
		this.$emit('created', { instance: this.instance, plugins: this.plugins })
	},
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
				emit?.('rendered', value)
				emit?.('update:rendered', value)
			}
		},
	)

	watch<boolean | undefined>(
		() => props.visible,
		(value) => {
			if (value !== undefined && value !== instance.visible) {
				instance.visible = value

				emit?.('visible', value)
				emit?.('update:visible', value)

				if (value) {
					emit?.('show', instance)
				} else {
					emit?.('hide', instance)
				}
			}
		},
	)

	return {
		rendered: useEventRef(instance.events as any, () => instance.rendered, ['change:rendered']),
		visible: useEventRef(instance.events as any, () => instance.visible, ['change:visible']),
		tag: useEventRef(instance.events as any, () => instance.tag, ['change:tag']),
		classes: useEventRef(instance.events as any, () => instance.classes.list, ['change:classes']),
	}
}

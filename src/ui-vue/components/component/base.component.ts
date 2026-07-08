import type { PropType, UnwrapNestedRefs, Ref } from 'vue'
import { watch } from 'vue'
import { useSyncProps } from '../../composables/useSyncProps'
import { type IComponent, type IComponentProps, TComponent } from '@core'
import type { TEmits, TProps, ISyncComponentOptions } from '../../types'

export const emitsComponent: TEmits = ['created'] as const

export const propsComponent: TProps = {
	ctrl: {
		type: Object as PropType<IComponent | UnwrapNestedRefs<IComponent>>,
	},
	id: {
		type: [String, Number] as PropType<IComponentProps['id']>,
		default: TComponent.defaultValues.id,
	},
}

export default {
	name: 'BaseComponent',
	emits: emitsComponent,
	props: propsComponent,
	created() {
		// @ts-ignore
		; (this.instance! as IComponent).id = this.$.uid
		// @ts-ignore
		this.$emit('created', { instance: this.instance, plugins: this.plugins })
	},
}

export interface IComponentState {
	rendered: Ref<boolean>
	visible: Ref<boolean>
	present: Ref<boolean>
}

export function syncComponent(
	options: ISyncComponentOptions<IComponentProps>,
): IComponentState {
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
		present: () => instance.present,
	})
}


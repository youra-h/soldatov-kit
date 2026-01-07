import { type PropType, watch } from 'vue'
import { type IPresentable, type IPresentableProps, TPresentable } from '../../../core'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../types'

export const emitsPresentable: TEmits = [
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
] as const

export const propsPresentable: TProps = {
	is: {
		type: Object as PropType<IPresentable>,
	},
	id: {
		type: [String, Number] as PropType<IPresentableProps['id']>,
		default: TPresentable.defaultValues.id,
	},
	tag: {
		type: [Object, String] as PropType<IPresentableProps['tag']>,
		default: TPresentable.defaultValues.tag,
	},
	rendered: {
		type: Boolean as PropType<IPresentableProps['rendered']>,
		default: TPresentable.defaultValues.rendered,
	},
	visible: {
		type: Boolean as PropType<IPresentableProps['visible']>,
		default: TPresentable.defaultValues.visible,
	},
}

export default {
	name: 'BasePresentable',
	emits: emitsPresentable,
	props: propsPresentable,
	created() {
		// @ts-ignore
		;(this.component! as IPresentable).id = this.$.uid
		// Emit 'created' event when component is created
		// @ts-ignore
		this.$emit('created', this.component)
	},
}

export function syncPresentable(options: ISyncComponentModelOptions<IPresentable>) {
	const { instance, props, emit } = options

	// Пробрасываем события core-инстанса наружу (Vue events).
	instance.events.on('created' as any, (component: IPresentable) => {
		emit?.('created', component)
	})

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
		emit?.('hide')
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

	watch<Object | string>(
		() => props.tag,
		(value) => {
			if (value !== instance.tag) {
				instance.tag = value
			}
		},
	)

	watch<boolean>(
		() => props.rendered,
		(value) => {
			if (value !== instance.rendered) {
				instance.rendered = value
				emit?.('rendered', value)
				emit?.('update:rendered', value)
			}
		},
	)

	watch<boolean>(
		() => props.visible,
		(value) => {
			if (value !== instance.visible) {
				instance.visible = value

				emit?.('visible', value)
				emit?.('update:visible', value)

				if (value) {
					emit?.('show', instance)
				} else {
					emit?.('hide')
				}
			}
		},
	)
}

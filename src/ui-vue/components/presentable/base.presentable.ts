import { type PropType, watch } from 'vue'
import { type IPresentable, type IPresentableProps, TPresentable } from '../../../core'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../types'

export const emitsPresentable: TEmits = [
	'update:visible',
	'hide',
	'show',
	'visible',
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
	visible: {
		type: Boolean as PropType<IPresentableProps['visible']>,
		default: TPresentable.defaultValues.visible,
	},
	// hidden: {
	// 	type: Boolean as PropType<IPresentable['hidden']>,
	// 	default: TPresentable.defaultValues.hidden,
	// },
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

	watch<Object | string>(
		() => props.tag,
		(value) => {
			if (value !== instance.tag) {
				instance.tag = value
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

	// watch<boolean>(
	// 	() => props.hidden,
	// 	(value) => {
	// 		if (value !== instance.hidden) {
	// 			instance.hidden = value
	// 		}
	// 	},
	// )
}

import { type PropType, watch } from 'vue'
import { type IComponent, defaultValuesComponent } from '../../../core'
import type { TEmits, TProps, ISyncComponentOptions } from '../../common/types'

export const emitsComponent: TEmits = [
	'update:visible',
	'hide',
	'show',
	'visible',
	'created',
] as const

export const propsComponent: TProps = {
	is: {
		type: Object as PropType<IComponent>,
	},
	id: {
		type: [String, Number] as PropType<IComponent['id']>,
		default: defaultValuesComponent.id,
	},
	tag: {
		type: [Object, String] as PropType<IComponent['tag']>,
		default: defaultValuesComponent.tag,
	},
	visible: {
		type: Boolean as PropType<IComponent['visible']>,
		default: defaultValuesComponent.visible,
	},
	hidden: {
		type: Boolean as PropType<IComponent['hidden']>,
		default: defaultValuesComponent.hidden,
	},
}

export default {
	name: 'BaseComponent',
	emits: emitsComponent,
	props: propsComponent,
	created() {
		// @ts-ignore
		;(this.component! as IComponent).id = this.$.uid
		// Emit 'created' event when component is created
		// @ts-ignore
		this.$emit('created', this.component)
	},
}

export function syncComponent(options: ISyncComponentOptions<IComponent>) {
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

	watch<boolean>(
		() => props.hidden,
		(value) => {
			if (value !== instance.hidden) {
				instance.hidden = value
			}
		},
	)
}

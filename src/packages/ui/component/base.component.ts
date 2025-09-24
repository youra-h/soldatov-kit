import { type PropType, watch } from 'vue'
import { type IComponent, defaultValuesComponent } from '../../../core'
import type { TEmits, TProps } from '../../common/types'

export const componentEmits: TEmits = [
	'update:visible',
	'hide',
	'show',
	'visible',
	'mounted',
	'created',
] as const

export const componentProps: TProps = {
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
	emits: componentEmits,
	props: componentProps,
}

export function syncComponent(props: TProps, instance: IComponent) {
	watch<Object | string>(
		() => props.tag,
		(value) => {
			if (value !== instance.tag) {
				instance.tag = value
			}
		}
	)

	watch<boolean>(
		() => props.visible,
		(value) => {
			if (value !== instance.visible) {
				instance.visible = value
			}
		}
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

import { type PropType, watch } from 'vue'
import { type IComponent, defaultComponentValues } from '../../../core'
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
	component: {
		type: Object as PropType<IComponent>,
	},
	id: {
		type: [String, Number] as PropType<IComponent['id']>,
		default: defaultComponentValues.id,
	},
	tag: {
		type: [Object, String] as PropType<IComponent['tag']>,
		default: defaultComponentValues.tag,
	},
	visible: {
		type: Boolean as PropType<IComponent['visible']>,
		default: defaultComponentValues.visible,
	},
	hidden: {
		type: Boolean as PropType<IComponent['hidden']>,
		default: defaultComponentValues.hidden,
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
		},
		{ immediate: true },
	)

	watch<boolean>(
		() => props.visible,
		(value) => {
			if (value !== instance.visible) {
				instance.visible = value
			}
		},
		{ immediate: true },
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

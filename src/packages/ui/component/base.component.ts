import { type PropType, watch } from 'vue'
import { type IComponent, defaultComponentValues } from '../../../core/component'
import type { TEmits, TProps } from '../../core/types'

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

export function useComponentWatchers(props: TProps, instance: IComponent) {
	watch<boolean | undefined>(
		() => props.visible,
		(value) => {
			if (value !== instance.visible) {
				instance.visible = value
			}
		},
	)

	watch<boolean | undefined>(
		() => props.hidden,
		(value) => {
			if (value !== instance.hidden) {
				instance.hidden = value
			}
		},
	)
}

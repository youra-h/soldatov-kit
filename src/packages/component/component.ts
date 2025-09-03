import { type PropType } from 'vue'
import { type IComponent, defaultComponentValues } from './../../core/component'

export const componentEmits = [
	'update:visible',
	'hide',
	'show',
	'visible',
	'mounted',
	'created',
] as const

export default {
	name: 'KBaseComponent',
	emits: componentEmits,
	props: {
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
	},
}

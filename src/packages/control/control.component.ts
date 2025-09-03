import { type PropType } from 'vue'
import type { IControl } from '../../core/control'
import { KBaseComponent, componentEmits } from '../component'

export const controlEmits = [
	...componentEmits,
	'update:text',
	'update:disabled',
	'update:focused',
] as const

export default {
	name: 'KBaseControl',
	extends: KBaseComponent,
	emits: controlEmits,
	props: {
		text: {
			type: String as PropType<IControl['text']>,
			default: '',
		},
		disabled: {
			type: Boolean as PropType<IControl['disabled']>,
			default: false,
		},
		focused: {
			type: Boolean as PropType<IControl['focused']>,
			default: false,
		},
	},
}

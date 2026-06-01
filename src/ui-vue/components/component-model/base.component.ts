import type { PropType, UnwrapNestedRefs } from 'vue'
import { type IComponentModel, type IComponentModelProps, TComponentModel } from '@core'
import type { TEmits, TProps } from '../../types'

export const emitsComponentModel: TEmits = ['created'] as const

export const propsComponentModel: TProps = {
	ctrl: {
		type: Object as PropType<IComponentModel | UnwrapNestedRefs<IComponentModel>>,
	},
	id: {
		type: [String, Number] as PropType<IComponentModelProps['id']>,
		default: TComponentModel.defaultValues.id,
	},
}

export default {
	name: 'BaseComponentModel',
	emits: emitsComponentModel,
	props: propsComponentModel,
	created() {
		// @ts-ignore
		;(this.instance! as IComponentModel).id = this.$.uid
		// @ts-ignore
		this.$emit('created', { instance: this.instance, plugins: this.plugins })
	},
}

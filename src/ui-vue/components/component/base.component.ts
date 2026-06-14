import type { PropType, UnwrapNestedRefs } from 'vue'
import { type IComponent, type IComponentProps, TComponent } from '@core'
import type { TEmits, TProps } from '../../types'

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
		;(this.instance! as IComponent).id = this.$.uid
		// @ts-ignore
		this.$emit('created', { instance: this.instance, plugins: this.plugins })
	},
}

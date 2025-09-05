import { type PropType } from 'vue'
import { type IComponent, defaultComponentValues } from '../../../core/component'
import type { TEmits, TProps } from '../../core/types'
import { useManagedInstance } from '../../core/useManagedInstance'

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

/**
 * Use a managed instance of a component.
 * @param Ctor The constructor of the component.
 * @param props The props to pass to the component.
 * @param key The key to use for the component instance in the props.
 * @returns The managed instance of the component.
 */
export function baseSetup<T>(Ctor: new (props: any) => T, props: any, key: string = 'component') {
	const instance = useManagedInstance(Ctor, props, key)

	return { component: instance }
}

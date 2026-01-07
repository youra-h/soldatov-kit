import { reactive } from 'vue'
import { useManagedInstance } from '../../packages/common/useManagedInstance'

/**
 * Use a managed instance of a component.
 * @param Ctor The constructor of the component.
 * @param props The props to pass to the component.
 * @param key The key to use for the component instance in the props.
 * @returns The managed instance of the component.
 */
export function useBaseSetup<T extends object>(
	Ctor: new (props: any) => T,
	props: any,
	key: string = 'is',
) {
	const instance = useManagedInstance(Ctor, props, key)

	const reactiveInstance = reactive(instance)

	return { is: reactiveInstance }
}

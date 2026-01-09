import { shallowReactive, isProxy, type ShallowReactive } from 'vue'
import { type IComponentModelOptions } from '@core'
import { useManagedInstance } from './useManagedInstance'

/**
 * Use a managed instance of a component.
 * @param Ctor The constructor of the component.
 * @param props The props to pass to the component.
 * @param key The key to use for the component instance in the props.
 * @returns The managed instance of the component.
 */
export function useBaseSetup<T extends object>(
	Ctor: new (options: IComponentModelOptions<any>) => T,
	props: any,
	key: string = 'is',
) {
	const instance = useManagedInstance(Ctor, props, key)

	const reactiveInstance = (
		isProxy(instance) ? instance : shallowReactive(instance)
	) as ShallowReactive<T>

	return { is: reactiveInstance }
}

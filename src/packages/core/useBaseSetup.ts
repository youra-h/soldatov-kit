import { useManagedInstance } from './useManagedInstance'

/**
 * Use a managed instance of a component.
 * @param Ctor The constructor of the component.
 * @param props The props to pass to the component.
 * @param key The key to use for the component instance in the props.
 * @returns The managed instance of the component.
 */
export function useBaseSetup<T>(Ctor: new (props: any) => T, props: any, key: string = 'component') {
	const instance = useManagedInstance(Ctor, props, key)

	return { component: instance }
}

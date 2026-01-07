import { type IComponentOptions } from '@core'

/**
 * Use a managed instance of a component.
 * @param Ctor The constructor of the component.
 * @param props The props to pass to the component.
 * @param key The key to use for the component instance in the props.
 * @returns The managed instance of the component.
 */
export function useManagedInstance<T>(
	Ctor: new (options: IComponentOptions<any>) => T,
	props: any,
	key: string = 'is',
): T {
	if (props[key] && props[key] instanceof Ctor) {
		return props[key]
	}

	return new Ctor({
		props,
	})
}

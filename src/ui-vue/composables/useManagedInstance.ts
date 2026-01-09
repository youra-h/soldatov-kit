import { type IComponentModelOptions } from '@core'
import { isProxy, toRaw } from 'vue'

/**
 * Use a managed instance of a component.
 * @param Ctor The constructor of the component.
 * @param props The props to pass to the component.
 * @param key The key to use for the component instance in the props.
 * @returns The managed instance of the component.
 */
export function useManagedInstance<T>(
	Ctor: new (options: IComponentModelOptions<any>) => T,
	props: any,
	key: string = 'is',
): T {
	const candidate = props[key]

	if (
		candidate &&
		(candidate instanceof Ctor || (isProxy(candidate) && toRaw(candidate) instanceof Ctor))
	) {
		return candidate
	}

	return new Ctor({
		props,
	})
}

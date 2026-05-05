import { reactive, toRaw, type Reactive } from 'vue'
import type { IComponentModelOptions } from '@core'

/**
 * Use a managed instance of a component.
 * @param Ctor The constructor of the component.
 * @param props The props to pass to the component.
 * @returns The managed instance of the component.
 */
export function useInstance<T extends object>(
	Ctor: new (options: IComponentModelOptions<any>) => T,
	props: any,
): Reactive<T> {
	const provided = props.ctrl

	const raw: T = provided ? (toRaw(provided) as T) : new Ctor({ props })

	return reactive(raw) as Reactive<T>
}

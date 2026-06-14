import { toRaw } from 'vue'
import type { IComponentOptions } from '@core'

/**
 * Returns a raw (non-reactive) instance of a component.
 * Use in event-based reactive components where reactivity is managed
 * explicitly via useEventState inside sync* functions.
 * @param Ctor The constructor of the component.
 * @param props The props to pass to the component.
 * @returns The managed instance of the component.
 */
export function useInstance<T extends object>(
	Ctor: new (options: IComponentOptions<any>) => T,
	props: any,
): T {
	const provided = props.ctrl
	return provided ? (toRaw(provided) as T) : new Ctor({ props })
}

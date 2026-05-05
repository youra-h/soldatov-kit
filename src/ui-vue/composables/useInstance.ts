import { reactive, toRaw, type Reactive } from 'vue'
import type { IComponentModelOptions } from '@core'

export function useInstance<T extends object>(
	Ctor: new (options: IComponentModelOptions<any>) => T,
	props: { ctrl?: T | Reactive<T>; [key: string]: any },
): Reactive<T> {
	const provided = props.ctrl

	const raw: T = provided ? (toRaw(provided) as T) : new Ctor({ props })

	return reactive(raw) as Reactive<T>
}

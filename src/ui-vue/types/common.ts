import type { UnwrapNestedRefs } from 'vue'

export type TEmits = readonly string[]
export type TProps = Readonly<Record<string, any>>

export interface ISyncComponentModelOptions<T> {
	instance: T | UnwrapNestedRefs<T>
	props: TProps
	emit?: (event: string, ...args: any[]) => void
}

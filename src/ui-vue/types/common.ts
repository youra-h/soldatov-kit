import type { UnwrapNestedRefs } from 'vue'

export type TEmits = readonly string[]
export type TProps = Readonly<Record<string, any>>

export interface ISyncComponentModelOptions<TProps, TInstance = any> {
	props: TProps
	instance: TInstance | UnwrapNestedRefs<TInstance>
	emit?: (...args: any[]) => void
}

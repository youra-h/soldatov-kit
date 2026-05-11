import type { UnwrapNestedRefs } from 'vue'
import { TComponentViewBundle } from '@plugins'
import type { IComponentView } from '@core'

export type TEmits = readonly string[]
export type TProps = Readonly<Record<string, any>>

export interface ISyncComponentModelOptions<
	TProps,
	TInstance = IComponentView,
	TPlugins = TComponentViewBundle,
> {
	props: TProps
	instance: TInstance | UnwrapNestedRefs<TInstance>
	plugins: TPlugins
	emit?: (...args: any[]) => void
}

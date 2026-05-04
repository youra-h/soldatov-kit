import type { UnwrapNestedRefs } from 'vue'
import { TComponentViewContainer } from '@plugins'
import type { IComponentView } from '@core'

export type TEmits = readonly string[]
export type TProps = Readonly<Record<string, any>>

export interface ISyncComponentModelOptions<
	TProps,
	TInstance = IComponentView,
	TPlugins = TComponentViewContainer,
> {
	props: TProps
	instance: TInstance | UnwrapNestedRefs<TInstance>
	plugins: TPlugins
	emit?: (...args: any[]) => void
}

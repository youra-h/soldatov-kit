import { type IPluginBundle } from '@plugins'
import type { IComponentView, IComponentModel } from '@core'

export type TEmits = readonly string[]
export type TProps = Readonly<Record<string, any>>

export interface ISyncComponentModelOptions<TProps, TInstance = IComponentModel> {
	props: TProps
	instance: TInstance
	emit?: (...args: any[]) => void
}

export interface ISyncComponentViewOptions<
	TProps,
	TInstance = IComponentView,
	TPlugins = IPluginBundle,
> extends ISyncComponentModelOptions<TProps, TInstance> {
	plugins: TPlugins
}

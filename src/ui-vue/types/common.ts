import { type IPluginBundle } from '@plugins'
import type { IComponentView, IComponent } from '@core'

export type TEmits = readonly string[]
export type TProps = Readonly<Record<string, any>>

export interface ISyncComponentOptions<TProps, TInstance = IComponent> {
	props: TProps
	instance: TInstance
	emit?: (...args: any[]) => void
}

export interface ISyncComponentViewOptions<
	TProps,
	TInstance = IComponentView,
	TPlugins = IPluginBundle,
> extends ISyncComponentOptions<TProps, TInstance> {
	plugins: TPlugins
}

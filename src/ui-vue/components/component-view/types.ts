import type { IComponentView } from '@core'
import type { IPluginBundle } from '@plugins'
import type { TBaseComponentModelProps } from '../component-model'

export type TBaseComponentViewProps<
	TCoreProps,
	TInstance extends IComponentView = IComponentView,
> = TBaseComponentModelProps<TCoreProps, TInstance> & {
	plugins?: IPluginBundle | undefined
}

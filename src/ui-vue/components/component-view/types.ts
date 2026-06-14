import type { IComponentView } from '@core'
import type { IPluginBundle } from '@plugins'
import type { TBaseComponentProps } from '../component'

export type TBaseComponentViewProps<
	TCoreProps,
	TInstance extends IComponentView = IComponentView,
> = TBaseComponentProps<TCoreProps, TInstance> & {
	plugins?: IPluginBundle | undefined
}

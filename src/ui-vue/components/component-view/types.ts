import type { IComponentView } from '@core'
import type { TBaseComponentProps } from '../component'

export type TBaseComponentViewProps<
	TCoreProps,
	TInstance extends IComponentView = IComponentView,
	> = TBaseComponentProps<TCoreProps, TInstance> & {}

import type { UnwrapNestedRefs } from 'vue'
import type { IComponentView } from '@core'
import { TComponentViewBundle } from '@plugins'

export type TBaseComponentViewProps<
	TCoreProps,
	TInstance extends IComponentView = IComponentView,
> = TCoreProps & {
	ctrl?: TInstance | UnwrapNestedRefs<TInstance>
	plugins?: TComponentViewBundle | undefined
}

import type { UnwrapNestedRefs } from 'vue'
import type { IComponentModel } from '@core'

export type TBaseComponentModelProps<
	TCoreProps,
	TInstance extends IComponentModel = IComponentModel,
> = TCoreProps & {
	ctrl?: TInstance | UnwrapNestedRefs<TInstance>
}

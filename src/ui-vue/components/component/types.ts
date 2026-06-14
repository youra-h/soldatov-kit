import type { UnwrapNestedRefs } from 'vue'
import type { IComponent } from '@core'

export type TBaseComponentProps<
	TCoreProps,
	TInstance extends IComponent = IComponent,
> = TCoreProps & {
	ctrl?: TInstance | UnwrapNestedRefs<TInstance>
}

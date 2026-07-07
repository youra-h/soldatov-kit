import type { UnwrapNestedRefs } from 'vue'
import type { IComponent } from '@core'
import type { IPluginBundle } from '@plugins'

export type TBaseComponentProps<
	TCoreProps,
	TInstance extends IComponent = IComponent,
> = TCoreProps & {
	ctrl?: TInstance | UnwrapNestedRefs<TInstance>
		plugins?: IPluginBundle | undefined
}

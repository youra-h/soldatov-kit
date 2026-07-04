import { createComponentViewBundle } from './component-view.bundle'
import { TInputControlPlugin } from '../common/input-control'
import { type IPluginBundle } from '../base'

export function createInputControlBundle(): IPluginBundle {
	return createComponentViewBundle()
		.use(TInputControlPlugin)
}

import { createInputControlBundle } from './input-control.bundle'
import { TInputPlugin } from '../common/input'
import { type IPluginBundle } from '../base'

export function createInputBundle(): IPluginBundle {
	return createInputControlBundle()
		.use(TInputPlugin)
}

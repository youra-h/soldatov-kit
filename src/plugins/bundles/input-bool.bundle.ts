import { createInputControlBundle } from './input-control.bundle'
import { TInputBoolPlugin } from '../common/input-bool'
import { type IPluginBundle } from '../base'

export function createInputBoolBundle(): IPluginBundle {
	return createInputControlBundle()
		.use(TInputBoolPlugin)
}

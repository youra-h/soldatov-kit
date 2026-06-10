import { createComponentViewBundle } from './component-view.bundle'
import type { IPluginBundle } from '../base'

export function createControlBundle(): IPluginBundle {
	return createComponentViewBundle()
}

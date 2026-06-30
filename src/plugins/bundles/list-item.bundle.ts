import { createComponentViewBundle } from './component-view.bundle'
import { TListItemPlugin } from '../common/list/item'
import type { IPluginBundle } from '../base'

export function createListItemBundle(): IPluginBundle {
	return createComponentViewBundle().use(TListItemPlugin)
}

import { createComponentViewBundle } from './component-view.bundle'
import { TTabsAppearancePlugin } from '../common/tabs/appearance'
import { type IPluginBundle } from '../base'

export function createTabsBundle(): IPluginBundle {
	return createComponentViewBundle().use(TTabsAppearancePlugin)
}

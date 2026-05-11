import { createComponentViewBundle } from './component-view.bundle'
import { TTabsAppearancePlugin } from '../common/tabs/appearance'

export function createTabsBundle() {
	return createComponentViewBundle().use(TTabsAppearancePlugin)
}

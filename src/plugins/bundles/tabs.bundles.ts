import { createComponentViewBundle } from './component-view.bundles'
import { TTabsAppearancePlugin } from '../common/tabs/appearance'

export function createTabsBundle() {
	return createComponentViewBundle().use(TTabsAppearancePlugin)
}

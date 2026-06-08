import { createComponentViewBundle } from './component-view.bundle'
import { createCollectionBundle } from './collection.bundle'
import { TTabsActiveTabPlugin } from '../common/tabs/active-tab'
import { TTabsAppearancePlugin } from '../common/tabs/appearance'
import { TTabsLayoutPlugin } from '../common/tabs/layout'
import { TDragPlugin } from '../common/drag-and-drop'
import { type IPluginBundle } from '../base'

export function createTabsBundle(): IPluginBundle {
	return createCollectionBundle(createComponentViewBundle())
		.use(TTabsLayoutPlugin)
		.use(TTabsActiveTabPlugin)
		.use(TTabsAppearancePlugin)
		.use(TDragPlugin)
}

import { createComponentViewBundle } from './component-view.bundle'
import { TTabsAppearancePlugin } from '../common/tabs/appearance'
import { TTabsLayoutPlugin } from '../common/tabs/layout'
import { TCollectionElementsPlugin, TCollectionInstancesPlugin } from '../common/collection'
import { TDragPlugin } from '../common/drag-and-drop'
import { type IPluginBundle } from '../base'

export function createTabsBundle(): IPluginBundle {
	return createComponentViewBundle()
		.use(TCollectionElementsPlugin)
		.use(TCollectionInstancesPlugin)
		.use(TTabsLayoutPlugin)
		.use(TTabsAppearancePlugin)
		.use(TDragPlugin)
}

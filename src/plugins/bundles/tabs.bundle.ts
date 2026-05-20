import { createComponentViewBundle } from './component-view.bundle'
import { TTabsAppearancePlugin } from '../common/tabs/appearance'
import { TTabsLayoutPlugin } from '../common/tabs/layout'
import { TCollectionElementsPlugin } from '../common/collection'
import { type IPluginBundle } from '../base'

export function createTabsBundle(): IPluginBundle {
	return createComponentViewBundle()
		.use(TCollectionElementsPlugin)
		.use(TTabsLayoutPlugin)
		.use(TTabsAppearancePlugin)
}

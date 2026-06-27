import { createComponentViewBundle } from './component-view.bundle'
import { createCollectionBundle } from './collection.bundle'
import { TListLayoutPlugin, TListScrollPlugin } from '../common/list'
import type { IPluginBundle } from '../base'

export function createListBundle(): IPluginBundle {
	return createCollectionBundle(createComponentViewBundle())
		.use(TListLayoutPlugin)
		.use(TListScrollPlugin)
}

import { createComponentViewBundle } from './component-view.bundle'
import { TCollectionElementsPlugin, TCollectionInstancesPlugin } from '../common/collection'
import { TCollapseHeightPlugin } from '../common/collapse'
import type { IPluginBundle } from '../base'

export function createCollapseBundle(): IPluginBundle {
	return createComponentViewBundle()
		.use(TCollectionElementsPlugin)
		.use(TCollectionInstancesPlugin)
		.use(TCollapseHeightPlugin)
}

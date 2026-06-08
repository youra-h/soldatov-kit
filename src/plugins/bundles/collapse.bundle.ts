import { createComponentViewBundle } from './component-view.bundle'
import { createCollectionBundle } from './collection.bundle'
import { TCollapseHeightPlugin } from '../common/collapse'
import { TDragPlugin } from '../common/drag-and-drop'
import type { IPluginBundle } from '../base'

export function createCollapseBundle(): IPluginBundle {
	return createCollectionBundle(createComponentViewBundle())
		.use(TCollapseHeightPlugin)
		.use(TDragPlugin)
}

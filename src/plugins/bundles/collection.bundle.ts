import { TCollectionItemPlugins } from '../common/collection'
import { TPluginBundle, type IPluginBundle } from '../base'

export function createCollectionBundle(bundle?: IPluginBundle): IPluginBundle {
	return (bundle ?? new TPluginBundle()).use(TCollectionItemPlugins)
}

import { inject } from 'vue'
import type { IPluginBundle } from '@plugins'
import { COLLECTION_PLUGINS_KEY } from './useProvideCollectionPlugins'
import { type TCollectionPluginsRegistrar } from './useProvideCollectionPlugins'

export function useInjectCollectionItemPlugins(uid: string | number, bundle: IPluginBundle): void {
	const registrar = inject(COLLECTION_PLUGINS_KEY, null) as TCollectionPluginsRegistrar | null

	if (!registrar) return

	registrar(uid, bundle)
}

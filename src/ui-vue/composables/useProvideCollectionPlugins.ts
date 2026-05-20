import { provide, type InjectionKey } from 'vue'
import type { IPluginBundle } from '@plugins'

export type TCollectionPluginsRegistrar = (uid: string | number, bundle: IPluginBundle) => void

export const COLLECTION_PLUGINS_KEY: InjectionKey<TCollectionPluginsRegistrar> =
	Symbol('collection-plugins')

export function useProvideCollectionPlugins(registrar: TCollectionPluginsRegistrar): void {
	provide(COLLECTION_PLUGINS_KEY, registrar)
}

import type { IPluginBundle } from '../../base/types'

export type {
	TElementAccumulationEvents as TCollectionElementsPluginEvents,
	TInstanceAccumulationEvents as TCollectionInstancesPluginEvents,
	TElementAccumulationEvents,
	TInstanceAccumulationEvents,
} from './accumulation/types'

export type TCollectionItemPluginsEvents = {
	'item:registered': (payload: { uid: string | number; bundle: IPluginBundle }) => void
	'item:unregistered': (payload: { uid: string | number }) => void
}

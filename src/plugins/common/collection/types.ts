import { type IComponentView } from '../../../core'
import type { IPluginBundle } from '../../base/types'

export type TCollectionElementsPluginEvents = {
	'element:added': (payload: { uid: string | number; element: HTMLElement }) => void
	'element:removed': (payload: { uid: string | number }) => void
	'element:present': (payload: { uid: string | number; present: boolean }) => void
}

export type TCollectionInstancesPluginEvents = {
	'instance:added': (payload: { uid: string | number; instance: IComponentView }) => void
	'instance:removed': (payload: { uid: string | number }) => void
}

export type TCollectionItemPluginsEvents = {
	'item:registered': (payload: { uid: string | number; bundle: IPluginBundle }) => void
	'item:unregistered': (payload: { uid: string | number }) => void
}

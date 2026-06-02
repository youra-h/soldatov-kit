import { type IComponentView } from '../../../core'

export type TCollectionElementsPluginEvents = {
	'element:added': (payload: { uid: string | number; element: HTMLElement }) => void
	'element:removed': (payload: { uid: string | number }) => void
}

export type TCollectionInstancesPluginEvents = {
	'instance:added': (payload: { uid: string | number; instance: IComponentView }) => void
	'instance:removed': (payload: { uid: string | number }) => void
}

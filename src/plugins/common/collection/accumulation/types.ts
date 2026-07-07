import type { IComponentView } from '@core'

/** События плагина накопления DOM-элементов */
export type TElementAccumulationEvents = {
	'element:added': (payload: { uid: string | number; element: HTMLElement }) => void
	'element:removed': (payload: { uid: string | number }) => void
	'element:present': (payload: { uid: string | number; present: boolean }) => void
}

/** События плагина накопления инстансов */
export type TInstanceAccumulationEvents = {
	'instance:added': (payload: { uid: string | number; instance: IComponentView }) => void
	'instance:removed': (payload: { uid: string | number }) => void
}

import type { IComponentView } from '../../core/base/component-view'

export type TInstancePluginEvents<T extends IComponentView = IComponentView> = {
	'instance:ready': (instance: T) => void
}

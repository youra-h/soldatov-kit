import type { IComponentView } from '../../core/base/component-view'

export type TInstancePluginEvents<T extends IComponentView = IComponentView> = {
	ready: (ctx: { instance: T }) => void
}

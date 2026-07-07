import type { IComponentView } from '@core'

export type TInstancePluginEvents<T extends IComponentView = IComponentView> = {
	ready: (ctx: { instance: T }) => void
	removed: () => void
}

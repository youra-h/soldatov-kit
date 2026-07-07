import type { IComponent } from '@core'

export type TInstancePluginEvents<T extends IComponent = IComponent> = {
	ready: (ctx: { instance: T }) => void
	removed: () => void
}

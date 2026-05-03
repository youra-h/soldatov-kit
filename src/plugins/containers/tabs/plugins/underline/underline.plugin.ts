import type { ITabs } from '../../../../../core/components/tabs'
import type { IPluginContainer } from '../../../../base/types'
import { TBasePlugin } from '../../../../base/plugin'
import { TElementPlugin } from '../../../../common/element'
import { TInstancePlugin } from '../../../../common/instance'
import type { TTabsUnderlinePluginEvents } from './types'

export class TTabsUnderlinePlugin extends TBasePlugin<TTabsUnderlinePluginEvents> {
	static readonly key = 'tabs-underline'

	private _element: HTMLElement | null = null
	private _tabs: ITabs | null = null

	override install(container: IPluginContainer): void {
		container.get(TElementPlugin)?.events.on('ready', ({ element }) => {
			this._element = element
			this._update()
		})

		container.get(TElementPlugin)?.events.on('removed', () => {
			this._element = null
		})

		const instancePlugin = container.get(TInstancePlugin) as TInstancePlugin<ITabs> | undefined

		instancePlugin?.events.on('ready', ({ instance }) => {
			this._tabs = instance
			instance.events.on('item:activated', () => this._update())
			instance.events.on('item:deactivated', () => this._update())
			instance.events.on('change:appearance', () => this._update())
			this._update()
		})
	}

	override destroy(): void {
		this._element = null
		this._tabs = null
		super.destroy()
	}

	private _update(): void {
		if (this._tabs?.appearance !== 'line') return
		if (!this._element) return

		const listEl = this._element.querySelector('.s-tabs__list') as HTMLElement | null
		if (!listEl) return

		const activeItem = this._tabs.activeItem
		const activeIndex = activeItem ? this._tabs.collection.items.indexOf(activeItem) : -1
		const activeEl = activeIndex >= 0 ? (listEl.children[activeIndex] as HTMLElement) : null

		const offsetLeft = activeEl ? activeEl.offsetLeft : 0
		const offsetWidth = activeEl ? activeEl.offsetWidth : 0

		listEl.style.setProperty('--underline-x', `${offsetLeft}px`)
		listEl.style.setProperty('--underline-width', `${offsetWidth}px`)
	}
}

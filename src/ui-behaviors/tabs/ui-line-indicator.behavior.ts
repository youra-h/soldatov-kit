import { TUiBehavior } from '../base/ui-behavior.class'
import type { TEventHandler } from '../../core/common/event-emitter'
import type { ITabs } from '../../core/components/tabs/types'
import type { ITabItem } from '../../core/components/tabs/tab-item/types'

/**
 * Поведение скользящего индикатора для appearance="line".
 *
 * Подписывается на события core-инстанса TTabs и обновляет
 * CSS custom properties --underline-x / --underline-width на __list элементе.
 * Использует ResizeObserver для реакции на изменение размеров табов.
 */
export class TUiLineIndicatorBehavior extends TUiBehavior {
	private _tabs: ITabs
	private _itemObservers = new Map<ITabItem, ResizeObserver>()

	private _onActivated: () => void
	private _onDeleted: () => void
	private _onMoved: () => void
	private _onAppearanceChange: () => void
	private _onItemAdded: TEventHandler

	constructor(tabs: ITabs) {
		super()

		this._tabs = tabs

		this._onActivated = () => requestAnimationFrame(() => this._update())
		this._onDeleted = () => requestAnimationFrame(() => this._update())
		this._onMoved = () => this._update()
		this._onAppearanceChange = () => this._update()
		this._onItemAdded = (...args: unknown[]) => {
			const payload = args[0] as { collection: any; item: any }
			const tabItem = payload.item as ITabItem

			tabItem.events.on('mount', ({ el }) => {
				const observer = new ResizeObserver(() => this._update())
				observer.observe(el)
				this._itemObservers.set(tabItem, observer)
			})

			tabItem.events.on('unmount', () => {
				this._itemObservers.get(tabItem)?.disconnect()
				this._itemObservers.delete(tabItem)
			})
		}

		tabs.events.on('item:activated', this._onActivated)
		tabs.events.on('item:deleted', this._onDeleted)
		tabs.events.on('item:moved', this._onMoved)
		tabs.events.on('change:appearance', this._onAppearanceChange)
		tabs.events.on('item:added', this._onItemAdded)

		this.events.on('ready', () => this._update())
	}

	private _update(): void {
		if (this._tabs.appearance !== 'line') return
		if (!this.el) return

		const listEl = this.el.querySelector('.s-tabs__list') as HTMLElement | null
		if (!listEl) return

		const activeEl = this._tabs.activeItem?.el as HTMLElement | null
		const offsetLeft = activeEl ? activeEl.offsetLeft : 0
		const offsetWidth = activeEl ? activeEl.offsetWidth : 0

		listEl.style.setProperty('--underline-x', `${offsetLeft}px`)
		listEl.style.setProperty('--underline-width', `${offsetWidth}px`)
	}

	override free(): void {
		this._tabs.events.off('item:activated', this._onActivated)
		this._tabs.events.off('item:deleted', this._onDeleted)
		this._tabs.events.off('item:moved', this._onMoved)
		this._tabs.events.off('change:appearance', this._onAppearanceChange)
		this._tabs.events.off('item:added', this._onItemAdded)

		this._itemObservers.forEach((observer) => observer.disconnect())
		this._itemObservers.clear()
	}
}

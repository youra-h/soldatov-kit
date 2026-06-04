import type { ITabs, TTabsAppearance } from '../../../../core/components/tabs'
import type { IPluginBundle } from '../../../base/types'
import { TBasePlugin } from '../../../base/plugin'
import { TElementPlugin } from '../../element'
import { TInstancePlugin } from '../../instance'
import { TTabsActiveTabPlugin } from '../active-tab'
import type { TActiveTabOffset } from '../active-tab'
import type { TTabsAppearancePluginEvents } from './types'

type TAppearanceHandler = (offset: TActiveTabOffset | null) => void

export class TTabsAppearancePlugin extends TBasePlugin<TTabsAppearancePluginEvents> {
	static readonly key = 'tabs-appearance'

	private _tabs: ITabs | null = null

	private readonly _handlers: Partial<Record<TTabsAppearance, TAppearanceHandler>> = {
		line: (offset) => this._updateLine(offset),
		outline: (offset) => this._updateOutline(offset),
	}

	override install(bundle: IPluginBundle): void {
		bundle.get(TElementPlugin)?.events.on('ready', () => {
			if (this._tabs?.appearance === 'line') {
				this._tabs.classes.add('--ready-animation')
			}
		})

		const instancePlugin = bundle.get(TInstancePlugin) as TInstancePlugin<ITabs> | undefined

		instancePlugin?.events.on('ready', ({ instance }) => {
			this._tabs = instance
		})

		bundle.get(TTabsActiveTabPlugin)?.events.on('active-tab:change', (offset) => {
			if (!this._tabs) return
			this._handlers[this._tabs.appearance]?.(offset)
		})
	}

	override destroy(): void {
		this._tabs = null

		super.destroy()
	}

	private _updateLine(offset: TActiveTabOffset | null): void {
		if (!offset) return
		if (!this._tabs!.activeItem && this._tabs!.hasEnabledTabs()) return

		const { listEl, offsetLeft, offsetWidth, offsetTop, offsetHeight } = offset

		if (this._tabs!.orientation === 'vertical') {
			listEl.style.setProperty('--underline-pos', `${offsetTop}px`)
			listEl.style.setProperty('--underline-size', `${offsetHeight}px`)
		} else {
			listEl.style.setProperty('--underline-pos', `${offsetLeft}px`)
			listEl.style.setProperty('--underline-size', `${offsetWidth}px`)
		}
	}

	private _updateOutline(offset: TActiveTabOffset | null): void {
		if (!offset) return

		const { listEl, offsetLeft, offsetWidth, offsetTop, offsetHeight } = offset

		if (this._tabs!.orientation === 'vertical') {
			listEl.style.setProperty('--gap-pos', `${offsetTop + 1}px`)
			listEl.style.setProperty('--gap-size', `${offsetHeight - 1}px`)
		} else {
			listEl.style.setProperty('--gap-pos', `${offsetLeft + 1}px`)
			listEl.style.setProperty('--gap-size', `${offsetWidth - 1}px`)
		}
	}
}

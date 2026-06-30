import type { IListItem } from '@core'
import { TBasePlugin } from '../../../base'
import { TInstancePlugin } from '../../instance'
import type { IPluginBundle } from '../../../base/types'
import type { TListItemPluginEvents } from './types'

export class TListItemPlugin extends TBasePlugin<TListItemPluginEvents> {
	static readonly key = 'list-item'

	private _highlighted = false
	private _instancePlugin: TInstancePlugin | null = null

	override install(bundle: IPluginBundle): void {
		this._instancePlugin = bundle.get(TInstancePlugin) ?? null
	}

	get highlighted(): boolean {
		return this._highlighted
	}

	set highlighted(value: boolean) {
		if (this._highlighted === value) return

		this._highlighted = value

		this.events.emit('change:highlighted', value)
	}

	select(): void {
		const instance = this._instancePlugin?.instance as IListItem | undefined
		if (instance) instance.selected = true
	}

	deselect(): void {
		const instance = this._instancePlugin?.instance as IListItem | undefined
		if (instance) instance.selected = false
	}

	toggleSelected(): void {
		const instance = this._instancePlugin?.instance as IListItem | undefined

		if (instance) instance.toggleSelected()
	}
}

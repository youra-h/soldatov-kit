import TListItem from '../../list/list-item/list-item.class'
import type { TListBoxAppearance } from '../types'

export default class TListBoxItem extends TListItem {
	static override baseClass = 's-list-box-item'

	private _appearanceResolver: (() => TListBoxAppearance) | undefined

	setAppearanceResolver(resolver: () => TListBoxAppearance): void {
		this._appearanceResolver = resolver
	}

	get appearance(): TListBoxAppearance {
		return this._appearanceResolver?.() ?? 'plain'
	}
}

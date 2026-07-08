import { TListItem } from '../../list'
import type { TListBoxView } from '../types'

export default class TListBoxItem extends TListItem {
	static override baseClass = 's-list-box-item'

	private _viewResolver: (() => TListBoxView) | undefined

	setViewResolver(resolver: () => TListBoxView): void {
		this._viewResolver = resolver
	}

	get view(): TListBoxView {
		return this._viewResolver?.() ?? 'plain'
	}
}

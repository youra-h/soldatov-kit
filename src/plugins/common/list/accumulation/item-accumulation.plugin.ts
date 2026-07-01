import type { IPluginBundle } from '../../../base/types'
import { TAccumulationPlugin } from '../../collection/accumulation'
import { TListItemPlugin } from '../item/item.plugin'

/**
 * Накопление {@link TListItemPlugin} для всех элементов списка.
 *
 * Позволяет получить плагин элемента по uid через {@link getByUid},
 * что используется в клавиатурной навигации и других плагинах,
 * которым нужно управлять состоянием конкретного элемента.
 */
export class TListItemAccumulationPlugin extends TAccumulationPlugin<TListItemPlugin> {
	static readonly key = 'list-item-accumulation'

	protected _track(uid: string | number, bundle: IPluginBundle): void {
		const plugin = bundle.get(TListItemPlugin)

		if (plugin) this._add(uid, plugin)
	}
}

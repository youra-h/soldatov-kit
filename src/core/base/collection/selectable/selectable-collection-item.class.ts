import { TCollectionItem } from '../item/collection-item.class'
import type {
	ISelectableCollectionItem,
	ISelectableCollectionItemProps,
	TSelectableItemEvents,
} from './types'

/**
 * Элемент коллекции с поддержкой выбранности.
 *
 * Наследуется от {@link TCollectionItem} и добавляет флаг `selected`.
 *
 * @template TProps Тип пропсов элемента
 * @template TEvents Тип событий элемента
 */
export class TSelectableCollectionItem<
		TProps extends ISelectableCollectionItemProps = ISelectableCollectionItemProps,
		TEvents extends
			TSelectableItemEvents<ISelectableCollectionItem> = TSelectableItemEvents<ISelectableCollectionItem>,
	>
	extends TCollectionItem<TProps, TEvents>
	implements ISelectableCollectionItem
{
	private _selected = false

	get selected(): boolean {
		return this._selected
	}

	set selected(value: boolean) {
		if (this._selected !== value) {
			this._selected = value

			this.events.emit('change', this)
		}
	}

	/**
	 * Переключает состояние выбранности.
	 */
	toggleSelected(): void {
		this.selected = !this.selected
	}
}

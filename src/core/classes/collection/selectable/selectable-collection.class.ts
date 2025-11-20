import { TCollection } from '../collection.class'
import { TSelectableCollectionItem } from './selectable-collection-item.class'
import type {
	ISelectableCollection,
	ISelectableCollectionProps,
	TSelectableCollectionEvents,
	ISelectableCollectionItem,
	TSelectionMode,
} from './types'
import type { TConstructor } from '../../../common/types'

/**
 * Коллекция элементов с поддержкой выбора.
 */
export class TSelectableCollection<
		TProps extends ISelectableCollectionProps = ISelectableCollectionProps,
		TEvents extends TSelectableCollectionEvents = TSelectableCollectionEvents,
		TItem extends ISelectableCollectionItem = ISelectableCollectionItem,
	>
	extends TCollection<TProps, TEvents, TItem>
	implements ISelectableCollection<TProps, TEvents, TItem>
{
	protected _mode: TSelectionMode
	private _selected: Set<TItem> = new Set()

	constructor(options?: { itemClass?: TConstructor<TItem>; mode?: TSelectionMode }) {
		super({
			itemClass: (options?.itemClass ?? TSelectableCollectionItem) as TConstructor<TItem>,
		})

		this._mode = options?.mode ?? 'single'
	}

	get mode(): TSelectionMode {
		return this._mode
	}

	set mode(value: TSelectionMode) {
		if (this._mode === value) return

		if (value === 'single' && this._selected.size > 1) {
			// оставить выбранным только первый
			const first = this._selected.values().next().value as TItem
			this._selected.forEach((it) => {
				if (it !== first) it.selected = false
			})
			this._selected.clear()
			this._selected.add(first)
		}

		if (value === 'none') {
			// полностью очистить выбор
			this.clearSelection()
		}

		this._mode = value
	}
	get selected(): TItem[] {
		return Array.from(this._selected)
	}

	get selectedCount(): number {
		return this._selected.size
	}

	get multiple(): boolean {
		return this._mode === 'multiple'
	}

	get single(): boolean {
		return this._mode === 'single'
	}

	/** Переопределяем add, чтобы подписаться на события элемента */
	add(source: Partial<TItem> = {}): TItem {
		const item = super.add(source)
		this._subscribeItem(item)
		return item
	}

	/**
	 * Подписка на события элемента
	 * @param item Элемент коллекции
	 */
	private _subscribeItem(item: TItem): void {
		item.events.on('change', (changedItem: TItem) => {
			if (this._mode === 'none') {
				// в режиме none игнорируем выбор
				changedItem.selected = false
				return
			}

			if (changedItem.selected) {
				if (!this.multiple) {
					// снять выделение с предыдущего
					const prev = this._selected.values().next().value as TItem | undefined

					if (prev && prev !== changedItem) {
						prev.selected = false
						this._selected.clear()
					}
				}

				this._selected.add(changedItem)
			} else {
				this._selected.delete(changedItem)
			}

			this.events.emit('change', { collection: this, items: this.selected })
		})
	}

	clearSelection(): void {
		this._selected.forEach((it) => (it.selected = false))

		this._selected.clear()

		this.events.emit('change', { collection: this, items: [] })
	}
}

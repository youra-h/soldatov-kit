import { TCollection } from '../collection.class'
import { TSelectableCollectionItem } from './selectable-collection-item.class'
import type {
	ISelectableCollection,
	ISelectableCollectionProps,
	TSelectableCollectionEvents,
	ISelectableCollectionItem,
	TSelectionMode,
	TSelectableItemEvents,
} from './types'
import type { TConstructor } from '../../../common/types'
import { TEvented } from '../../../common/evented'

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
	static defaultValues: Partial<ISelectableCollectionProps> = {
		mode: 'single',
	}

	protected _mode: TSelectionMode
	private _selected: Set<TItem> = new Set()

	constructor(options?: { itemClass?: TConstructor<TItem>; mode?: TSelectionMode }) {
		super({
			itemClass: (options?.itemClass ?? TSelectableCollectionItem) as TConstructor<TItem>,
		})

		this._mode = options?.mode ?? TSelectableCollection.defaultValues.mode!
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
			this.clear()
		}

		this._mode = value
		;(this.events as TEvented<TSelectableCollectionEvents>).emit('change:mode', value)
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

	/**
	 * Переопределяем хук для подписки на события элемента перед assign
	 * @param item Элемент коллекции
	 * @protected
	 */
	protected override _onAfterItemAdd(item: TItem): void {
		this._subscribeItem(item)

		// assign() мог установить selected:true до подписки — обрабатываем начальное состояние явно
		if (item.selected) {
			;(item.events as TEvented<TSelectableItemEvents<TItem>>).emit('change:selection', item)
		}
	}

	/**
	 * Подписка на события элемента
	 * @param item Элемент коллекции
	 */
	protected _subscribeItem(item: TItem): void {
		const _notifySelected = () => {
			;(this.events as TEvented<TSelectableCollectionEvents>).emit(
				'change:selected',
				this.selected,
			)
			;(this.events as TEvented<TSelectableCollectionEvents>).emit(
				'change:selectedCount',
				this.selectedCount,
			)
		}

		item.events.on('change:selection', (changedItem: TItem) => {
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
				;(this.events as TEvented<TSelectableCollectionEvents>).emit('item:selected', {
					collection: this,
					item: changedItem,
				})
				_notifySelected()
			} else {
				this._selected.delete(changedItem)
				;(this.events as TEvented<TSelectableCollectionEvents>).emit('item:unselected', {
					collection: this,
					item: changedItem,
				})
				_notifySelected()
			}
		})
	}

	clear(): void {
		this._selected.forEach((it) => (it.selected = false))

		this._selected.clear()
		;(this.events as TEvented<TSelectableCollectionEvents>).emit('selection:cleared', {
			collection: this,
		})
		;(this.events as TEvented<TSelectableCollectionEvents>).emit(
			'change:selected',
			this.selected,
		)
		;(this.events as TEvented<TSelectableCollectionEvents>).emit(
			'change:selectedCount',
			this.selectedCount,
		)
	}
}

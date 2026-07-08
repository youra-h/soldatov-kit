import { TCollection } from '../collection.class'
import { TSelectableCollectionItem } from './selectable-collection-item.class'
import type {
	ISelectableCollection,
	ISelectableCollectionProps,
	TSelectableCollectionEvents,
	ISelectableCollectionItem,
	ISelectableCollectionItemMeta,
	TSelectionMode,
	TSelectableItemEvents,
} from './types'
import type { TConstructor } from '../../../../common'
import { TEvented } from '../../../../common'

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

		const ctor = new.target as typeof TSelectableCollection

		this._mode = options?.mode ?? ctor.defaultValues.mode!
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
			this.reset()
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
	 * Применяет meta-данные (selected) к элементу.
	 */
	protected override _assignItemMeta(item: TItem, meta: ISelectableCollectionItemMeta): void {
		if (meta?.selected !== undefined) {
			item.selected = meta.selected
		}
	}

	/**
	 * Переопределяем хук для подписки на события элемента.
	 * Если элемент уже помечен как selected (из _assignItemMeta),
	 * добавляем в _selected без эмита событий — это инициализация, не изменение выделения.
	 * @param item Элемент коллекции
	 * @protected
	 */
	protected override _onAfterItemAdd(item: TItem): void {
		this._subscribeItem(item)

		if (item.selected) {
			if (!this.multiple) {
				this._selected.clear()
			}

			this._selected.add(item)
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

	/**
	 * Переопределяем delete, чтобы очищать _selected при удалении элемента.
	 */
	override delete(index: number): boolean {
		const item = this.getItem(index)

		if (item && this._selected.has(item)) {
			item.selected = false
		}

		return super.delete(index)
	}

	reset(): void {
		if (this._selected.size > 0) {
			this._selected.forEach((it) => (it.selected = false))

			this._selected.clear()
			;(this.events as TEvented<TSelectableCollectionEvents>).emit(
				'change:selected',
				this.selected,
			)
			;(this.events as TEvented<TSelectableCollectionEvents>).emit(
				'change:selectedCount',
				this.selectedCount,
			)
		}

		super.reset()
	}
}

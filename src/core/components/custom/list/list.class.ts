import { TControl } from '../../base/control'
import type { IComponentViewOptions } from '../../base/component-view'
import { TComponentView } from '../../base/component-view'
import { TSelectableCollection } from '../../base/collection'
import TListItem from './list-item/list-item.class'
import type { IListItem } from './list-item/types'
import type { IList, IListProps, TListEvents, TListStates } from './types'
import { TEvented } from '../../../common/event/evented'
import type { TSelectionMode } from '../../base/collection'
import type { TValuePayload, TComponentSize, TComponentVariant, TScrollBehavior } from '../../../bridge'

export class TList<
	TItem extends IListItem = IListItem,
	TProps extends IListProps = IListProps,
	TEvents extends TListEvents = TListEvents,
	TStates extends TListStates = TListStates,
>
	extends TControl<TProps, TEvents, TStates>
	implements IList<TItem, TProps, TEvents, TStates> {
	static override baseClass = 's-list'

	static defaultValues: Partial<IListProps> = {
		...TControl.defaultValues,
		mode: 'single',
		maxRows: 0,
		autoWidth: false,
		wordWrap: false,
		scrollBehavior: 'smooth',
	}

	protected _maxRows: number
	protected _autoWidth!: boolean
	protected _wordWrap!: boolean
	protected _scrollBehavior: TScrollBehavior
	protected _collection: TSelectableCollection<any, any, any>

	/**
	 * Создаёт коллекцию элементов списка.
	 *
	 * Переопределяется в потомках (например, {@link TListBox}) для подмены `itemClass`.
	 *
	 * @param mode - Режим выбора (`single` / `multiple` / `none`)
	 * @returns Новая `TSelectableCollection`
	 * @protected
	 */
	protected _createCollection(mode: TSelectionMode): TSelectableCollection<any, any, any> {
		return new TSelectableCollection<any, any, IListItem>({
			itemClass: TListItem,
			mode,
		})
	}

	constructor(options: IComponentViewOptions<TProps, TStates> | Partial<TProps> = {}) {
		super(options)

		const ctor = new.target as typeof TList

		const { props } = TComponentView.prepareOptions<TProps, TStates>(options)

		this._collection = this._createCollection(props.mode ?? ctor.defaultValues.mode!)

		if (props.items) {
			this._collection.setItems(props.items)
		}

		this._maxRows = props.maxRows ?? ctor.defaultValues.maxRows!

		this._applyAutoWidth(props.autoWidth ?? ctor.defaultValues.autoWidth!)
		this._applyWordWrap(props.wordWrap ?? ctor.defaultValues.wordWrap!)
		this._scrollBehavior = props.scrollBehavior ?? ctor.defaultValues.scrollBehavior!

		this.events.on('change:size', (payload: TValuePayload<TComponentSize>) => {
			this._collection.forEach((item) => {
				item.size = payload.newValue
			})
		})

		this.events.on('change:variant', (payload: TValuePayload<TComponentVariant>) => {
			this._collection.forEach((item) => {
				item.variant = payload.newValue
			})
		})

		this.events.relay(this._collection.events, [
			'item:selected',
			'item:unselected',
			'change:selected',
			'change:selectedCount',
			'change:mode',
			{
				from: 'item:added',
				then: (payload: any) => {
					const { item } = payload as { collection: any; item: IListItem }

					item.events.on('change:disabled', (value: boolean) => {
						; (this.events as TEvented<TListEvents>).emit('item:disabled', item, value)
					})

					item.events.on('change:text', (payload: TValuePayload<string>) => {
						; (this.events as TEvented<TListEvents>).emit(
							'item:text',
							item,
							payload.newValue,
						)
					})

					item.events.on('change:rendered', (value: boolean) => {
						; (this.events as TEvented<TListEvents>).emit('item:rendered', item, value)
					})

					item.events.on('change:visible', (value: boolean) => {
						; (this.events as TEvented<TListEvents>).emit('item:visible', item, value)
					})

					item.events.on('change:present', (value: boolean) => {
						; (this.events as TEvented<TListEvents>).emit('item:present', item, value)
					})

					item.setWordWrapResolver(() => this._wordWrap)

					item.disabled = this.disabled
					item.size = this.size
					item.variant = this.variant
				},
			},
			'item:beforeDelete',
			'item:deleted',
			'item:afterDelete',
			'item:beforeMove',
			'item:moved',
			'item:afterMove',
		])

		this.events.on('change:disabled', (value) => {
			this._collection.items.forEach((item) => {
				item.disabled = value
			})
		})
	}

	get mode(): TSelectionMode {
		return this._collection.mode
	}

	set mode(value: TSelectionMode) {
		this._collection.mode = value
	}

	get maxRows(): number {
		return this._maxRows
	}

	set maxRows(value: number) {
		if (this._maxRows !== value) {
			this._maxRows = value
				; (this.events as TEvented<TListEvents>).emit('change:maxRows', value)
		}
	}

	get autoWidth(): boolean {
		return this._autoWidth
	}

	protected _applyAutoWidth(newValue: boolean) {
		this._classes.toggle('--auto-width', newValue)

		this._autoWidth = newValue
	}

	set autoWidth(value: boolean) {
		if (this._autoWidth !== value) {
			this._applyAutoWidth(value)
				; (this.events as TEvented<TListEvents>).emit('change:autoWidth', value)
		}
	}

	get wordWrap(): boolean {
		return this._wordWrap
	}

	protected _applyWordWrap(newValue: boolean) {
		this._classes.toggle('--word-wrap', newValue)

		this._wordWrap = newValue
	}

	set wordWrap(value: boolean) {
		if (this._wordWrap !== value) {
			this._applyWordWrap(value)

			this._collection.forEach((item) => {
				item.notifyWordWrapChange()
			})
				; (this.events as TEvented<TListEvents>).emit('change:wordWrap', value)
		}
	}

	get scrollBehavior(): TScrollBehavior {
		return this._scrollBehavior
	}

	set scrollBehavior(value: TScrollBehavior) {
		if (this._scrollBehavior !== value) {
			this._scrollBehavior = value
				; (this.events as TEvented<TListEvents>).emit('change:scrollBehavior', value)
		}
	}

	/**
	 * Количество видимых (rendered) элементов с учётом maxRows.
	 * 0 = показать все видимые элементы.
	 * @returns Количество видимых элементов
	 */
	getVisibleItemCount(): number {
		let visible = 0

		for (const item of this._collection) {
			if (item.present) visible++
		}

		if (this._maxRows === 0) return visible

		return Math.min(this._maxRows, visible)
	}

	get collection(): TSelectableCollection<any, any, TItem> {
		return this._collection
	}

	override getProps(): TProps {
		return {
			...super.getProps(),
			mode: this._collection.mode,
			maxRows: this._maxRows,
			autoWidth: this._autoWidth,
			wordWrap: this._wordWrap,
			scrollBehavior: this._scrollBehavior,
		} as TProps
	}
}

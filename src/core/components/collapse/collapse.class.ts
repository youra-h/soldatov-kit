import TControl from '../../base/control/control.class'
import type { IComponentViewOptions } from '../../base/component-view'
import { TComponentView } from '../../base/component-view'
import { TSelectableCollection } from '../../base/collection'
import TCollapseItem from './collapse-item/collapse-item.class'
import type { ICollapseItem } from './collapse-item/types'
import type {
	ICollapse,
	ICollapseProps,
	TCollapseEvents,
	TCollapseStatesOptions,
	TCollapseAppearance,
} from './types'
import { TEvented } from '../../common/evented'
import type { TSelectionMode } from '../../base/collection'

export class TCollapse
	extends TControl<ICollapseProps, TCollapseEvents, TCollapseStatesOptions>
	implements ICollapse
{
	static override baseClass = 's-collapse'

	static defaultValues: Partial<ICollapseProps> = {
		...TControl.defaultValues,
		appearance: 'plain',
		mode: 'multiple',
	}

	protected _appearance!: TCollapseAppearance
	protected _collection: TSelectableCollection<any, any, ICollapseItem>

	constructor(
		options:
			| IComponentViewOptions<ICollapseProps, TCollapseStatesOptions>
			| Partial<ICollapseProps> = {},
	) {
		super(options)

		const ctor = new.target as typeof TCollapse

		const { props = {} } = TComponentView.prepareOptions<
			ICollapseProps,
			TCollapseStatesOptions
		>(options)

		this._collection = new TSelectableCollection<any, any, ICollapseItem>({
			itemClass: TCollapseItem,
			mode: props.mode ?? ctor.defaultValues.mode!,
		})

		this._applyAppearance(props.appearance ?? ctor.defaultValues.appearance!)

		this._collection.events.on(
			'item:selected',
			(payload: { collection: any; item: ICollapseItem }) => {
				;(this.events as TEvented<TCollapseEvents>).emit('item:selected', payload)
			},
		)

		this._collection.events.on(
			'item:unselected',
			(payload: { collection: any; item: ICollapseItem }) => {
				;(this.events as TEvented<TCollapseEvents>).emit('item:unselected', payload)
			},
		)

		this._collection.events.on('selection:cleared', (payload: { collection: any }) => {
			;(this.events as TEvented<TCollapseEvents>).emit('selection:cleared', payload)
		})

		this._collection.events.on('change:selected', (items: ICollapseItem[]) => {
			;(this.events as TEvented<TCollapseEvents>).emit('change:selected', items)
		})

		this._collection.events.on('change:selectedCount', (count: number) => {
			;(this.events as TEvented<TCollapseEvents>).emit('change:selectedCount', count)
		})

		this._collection.events.on('change:mode', (value: TSelectionMode) => {
			;(this.events as TEvented<TCollapseEvents>).emit('change:mode', value)
		})

		this._collection.events.on(
			'item:added',
			(payload: { collection: any; item: ICollapseItem }) => {
				const { item } = payload

				// Проброс change:disabled → item:disabled
				item.events.on('change:disabled', (value: boolean) => {
					;(this.events as TEvented<TCollapseEvents>).emit('item:disabled', item, value)
				})

				;(this.events as TEvented<TCollapseEvents>).emit('item:added', payload)
			},
		)

		this._collection.events.on(
			'item:beforeDelete',
			(payload: { collection: any; index: number; item: ICollapseItem }) => {
				;(this.events as TEvented<TCollapseEvents>).emit('item:beforeDelete', payload)
			},
		)

		this._collection.events.on(
			'item:deleted',
			(payload: { collection: any; item: ICollapseItem }) => {
				;(this.events as TEvented<TCollapseEvents>).emit('item:deleted', payload)
			},
		)

		this._collection.events.on(
			'item:afterDelete',
			(payload: { collection: any; index: number; item: ICollapseItem }) => {
				;(this.events as TEvented<TCollapseEvents>).emit('item:afterDelete', payload)
			},
		)

		this._collection.events.on(
			'item:beforeMove',
			(payload: { collection: any; oldIndex: number; newIndex: number }) => {
				;(this.events as TEvented<TCollapseEvents>).emit('item:beforeMove', payload)
			},
		)

		this._collection.events.on(
			'item:moved',
			(payload: {
				collection: any
				item: ICollapseItem
				oldIndex: number
				newIndex: number
			}) => {
				;(this.events as TEvented<TCollapseEvents>).emit('item:moved', payload)
			},
		)

		this._collection.events.on(
			'item:afterMove',
			(payload: {
				collection: any
				item: ICollapseItem
				oldIndex: number
				newIndex: number
			}) => {
				;(this.events as TEvented<TCollapseEvents>).emit('item:afterMove', payload)
			},
		)

		this._collection.events.on('cleared', (payload: { collection: any }) => {
			;(this.events as TEvented<TCollapseEvents>).emit('cleared', payload)
		})

		this.events.on('change:disabled', (value) => {
			this._collection.items.forEach((item) => {
				item.disabled = value
			})
		})
	}

	get appearance(): TCollapseAppearance {
		return this._appearance
	}

	protected _applyAppearance(newValue: TCollapseAppearance, oldValue?: TCollapseAppearance) {
		this._classes.swapClass({
			oldClass: `--${oldValue}`,
			newClass: `--${newValue}`,
		})

		this._appearance = newValue
	}

	set appearance(value: TCollapseAppearance) {
		if (this._appearance !== value) {
			this._applyAppearance(value, this._appearance)
			;(this.events as TEvented<TCollapseEvents>).emit('change:appearance', value)
		}
	}

	get mode(): TSelectionMode {
		return this._collection.mode
	}

	set mode(value: TSelectionMode) {
		this._collection.mode = value
	}

	get selected(): ICollapseItem[] {
		return this._collection.selected as ICollapseItem[]
	}

	get selectedCount(): number {
		return this._collection.selectedCount
	}

	get collection(): TSelectableCollection<any, any, ICollapseItem> {
		return this._collection
	}

	override getProps(): ICollapseProps {
		return {
			...super.getProps(),
			appearance: this._appearance,
			mode: this._collection.mode,
		}
	}
}

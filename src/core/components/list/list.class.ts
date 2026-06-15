import TControl from '../../base/control/control.class'
import type { IComponentViewOptions } from '../../base/component-view'
import { TComponentView } from '../../base/component-view'
import { TSelectableCollection } from '../../base/collection'
import TListItem from './list-item/list-item.class'
import type { IListItem } from './list-item/types'
import type {
	IList,
	IListProps,
	TListEvents,
	TListStates,
} from './types'
import { TEvented } from '../../common/evented'
import type { TSelectionMode } from '../../base/collection'
import { type TValuePayload } from '../../common/types'
import type { TComponentSize, TComponentVariant } from '../../common/types'

export class TList
	extends TControl<IListProps, TListEvents, TListStates>
	implements IList
{
	static override baseClass = 's-list'

	static defaultValues: Partial<IListProps> = {
		...TControl.defaultValues,
		mode: 'single',
	}

	protected _collection: TSelectableCollection<any, any, IListItem>

	constructor(
		options:
			| IComponentViewOptions<IListProps, TListStates>
			| Partial<IListProps> = {},
	) {
		super(options)

		const ctor = new.target as typeof TList

		const { props = {} } = TComponentView.prepareOptions<
			IListProps,
			TListStates
		>(options)

		this._collection = new TSelectableCollection<any, any, IListItem>({
			itemClass: TListItem,
			mode: props.mode ?? ctor.defaultValues.mode!,
		})

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
			'selection:cleared',
			'change:selected',
			'change:selectedCount',
			'change:mode',
			{
				from: 'item:added',
				then: (payload: any) => {
					const { item } = payload as { collection: any; item: IListItem }

					item.events.on('change:disabled', (value: boolean) => {
						;(this.events as TEvented<TListEvents>).emit(
							'item:disabled',
							item,
							value,
						)
					})

					item.events.on('change:text', (payload: TValuePayload<string>) => {
						;(this.events as TEvented<TListEvents>).emit(
							'item:text',
							item,
							payload.newValue,
						)
					})
				},
			},
			'item:beforeDelete',
			'item:deleted',
			'item:afterDelete',
			'item:beforeMove',
			'item:moved',
			'item:afterMove',
			'cleared',
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

	get selected(): IListItem[] {
		return this._collection.selected as IListItem[]
	}

	get selectedCount(): number {
		return this._collection.selectedCount
	}

	get collection(): TSelectableCollection<any, any, IListItem> {
		return this._collection
	}

	override getProps(): IListProps {
		return {
			...super.getProps(),
			mode: this._collection.mode,
		}
	}
}

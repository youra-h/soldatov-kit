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
	TCollapseStates,
	TCollapseView,
} from './types'
import { TEvented } from '../../../common/event/evented'
import type { TSelectionMode } from '../../base/collection'
import type { TValuePayload, TComponentSize, TComponentVariant } from '../../../bridge'

export class TCollapse
	extends TControl<ICollapseProps, TCollapseEvents, TCollapseStates>
	implements ICollapse {
	static override baseClass = 's-collapse'

	static defaultValues: Partial<ICollapseProps> = {
		...TControl.defaultValues,
		view: 'plain',
		mode: 'multiple',
	}

	protected _view!: TCollapseView
	protected _collection: TSelectableCollection<any, any, ICollapseItem>

	constructor(
		options:
			| IComponentViewOptions<ICollapseProps, TCollapseStates>
			| Partial<ICollapseProps> = {},
	) {
		super(options)

		const ctor = new.target as typeof TCollapse

		const { props = {} } = TComponentView.prepareOptions<ICollapseProps, TCollapseStates>(
			options,
		)

		this._collection = new TSelectableCollection<any, any, ICollapseItem>({
			itemClass: TCollapseItem,
			mode: props.mode ?? ctor.defaultValues.mode!,
		})

		if (props.items) {
			this._collection.setItems(props.items)
		}

		this._applyView(props.view ?? ctor.defaultValues.view!)

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
					const { item } = payload as { collection: any; item: ICollapseItem }

					item.setViewResolver(() => this._view)

					item.events.on('change:rendered', (value: boolean) => {
						; (this.events as TEvented<TCollapseEvents>).emit(
							'item:rendered',
							item,
							value,
						)
					})

					item.events.on('change:visible', (value: boolean) => {
						; (this.events as TEvented<TCollapseEvents>).emit(
							'item:visible',
							item,
							value,
						)
					})

					item.events.on('change:present', (value: boolean) => {
						; (this.events as TEvented<TCollapseEvents>).emit(
							'item:present',
							item,
							value,
						)
					})

					item.events.on('change:disabled', (value: boolean) => {
						; (this.events as TEvented<TCollapseEvents>).emit(
							'item:disabled',
							item,
							value,
						)
					})

					item.events.on('change:text', (payload: TValuePayload<string>) => {
						; (this.events as TEvented<TCollapseEvents>).emit(
							'item:text',
							item,
							payload.newValue,
						)
					})

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

	get view(): TCollapseView {
		return this._view
	}

	protected _applyView(newValue: TCollapseView, oldValue?: TCollapseView) {
		this._classes.swapClass({
			oldClass: `--${oldValue}`,
			newClass: `--${newValue}`,
		})

		this._view = newValue
	}

	set view(value: TCollapseView) {
		if (this._view !== value) {
			this._applyView(value, this._view)

			this._collection.forEach((item) => {
				item.events.emit('change:view', value)
			})
				; (this.events as TEvented<TCollapseEvents>).emit('change:view', value)
		}
	}

	get mode(): TSelectionMode {
		return this._collection.mode
	}

	set mode(value: TSelectionMode) {
		this._collection.mode = value
	}

	get collection(): TSelectableCollection<any, any, ICollapseItem> {
		return this._collection
	}

	override getProps(): ICollapseProps {
		return {
			...super.getProps(),
			view: this._view,
			mode: this._collection.mode,
		}
	}
}

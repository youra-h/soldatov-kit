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
import { type TValuePayload } from '../../common/types'

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
					const { item } = payload as { collection: any; item: ICollapseItem }

					item.setAppearanceResolver(() => this._appearance)

					item.events.on('change:disabled', (value: boolean) => {
						;(this.events as TEvented<TCollapseEvents>).emit(
							'item:disabled',
							item,
							value,
						)
					})

					item.events.on('change:text', (payload: TValuePayload<string>) => {
						;(this.events as TEvented<TCollapseEvents>).emit(
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

			this._collection.forEach((item) => {
				item.events.emit('change:appearance', value)
			})

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

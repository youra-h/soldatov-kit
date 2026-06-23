import { TList } from '../list/list.class'
import type { IComponentViewOptions } from '../../base/component-view'
import { TComponentView } from '../../base/component-view'
import { TSelectableCollection, type TSelectionMode } from '../../base/collection'
import TListBoxItem from './list-box-item/list-box-item.class'
import type { IListBoxItem } from './list-box-item/types'
import type {
	IListBoxProps,
	TListBoxAppearance,
	TListBoxEvents,
	TListBoxStates,
	IListBox,
} from './types'
import { TEvented } from '../../common/evented'

export class TListBox
	extends TList<IListBoxProps, TListBoxEvents, TListBoxStates, IListBoxItem>
	implements IListBox
{
	static override baseClass = 's-list-box'

	static defaultValues: Partial<IListBoxProps> = {
		...TList.defaultValues,
		appearance: 'plain',
	}

	protected _appearance!: TListBoxAppearance

	protected override _createCollection(
		mode: TSelectionMode,
	): TSelectableCollection<any, any, IListBoxItem> {
		return new TSelectableCollection<any, any, IListBoxItem>({
			itemClass: TListBoxItem,
			mode,
		})
	}

	constructor(
		options: IComponentViewOptions<IListBoxProps, TListBoxStates> | Partial<IListBoxProps> = {},
	) {
		super(options)

		const ctor = new.target as typeof TListBox

		const { props = {} } = TComponentView.prepareOptions<IListBoxProps, TListBoxStates>(options)

		this._applyAppearance(props.appearance ?? ctor.defaultValues.appearance!)

		this.events.relay(this._collection.events, [
			{
				from: 'item:added',
				then: (payload: any) => {
					const { item } = payload as { collection: any; item: IListBoxItem }

					item.setAppearanceResolver(() => this._appearance)
				},
			},
		])
	}

	get appearance(): TListBoxAppearance {
		return this._appearance
	}

	protected _applyAppearance(newValue: TListBoxAppearance, oldValue?: TListBoxAppearance) {
		this._classes.swapClass({
			oldClass: `--${oldValue}`,
			newClass: `--${newValue}`,
		})

		this._appearance = newValue
	}

	set appearance(value: TListBoxAppearance) {
		if (this._appearance !== value) {
			this._applyAppearance(value, this._appearance)

			this._collection.forEach((item) => {
				item.events.emit('change:appearance', value)
			})
			;(this.events as TEvented<TListBoxEvents>).emit('change:appearance', value)
		}
	}

	override getProps(): IListBoxProps {
		return {
			...super.getProps(),
			appearance: this._appearance,
		} as IListBoxProps
	}
}

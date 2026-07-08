import { TList } from '../list'
import type { IComponentViewOptions } from '../../base/component-view'
import { TComponentView } from '../../base/component-view'
import { TSelectableCollection, type TSelectionMode } from '../../base/collection'
import TListBoxItem from './list-box-item/list-box-item.class'
import type { IListBoxItem } from './list-box-item/types'
import type {
	IListBoxProps,
	TListBoxView,
	TListBoxEvents,
	TListBoxStates,
	IListBox,
} from './types'
import { TEvented } from '../../../common'

export class TListBox
	extends TList<IListBoxItem, IListBoxProps, TListBoxEvents, TListBoxStates>
	implements IListBox
{
	static override baseClass = 's-list-box'

	static defaultValues: Partial<IListBoxProps> = {
		...TList.defaultValues,
		view: 'plain',
	}

	protected _view!: TListBoxView

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

		this._applyView(props.view ?? ctor.defaultValues.view!)

		this.events.relay(this._collection.events, [
			{
				from: 'item:added',
				then: (payload: any) => {
					const { item } = payload as { collection: any; item: IListBoxItem }

					item.setViewResolver(() => this._view)
				},
			},
		])
	}

	get view(): TListBoxView {
		return this._view
	}

	protected _applyView(newValue: TListBoxView, oldValue?: TListBoxView) {
		this._classes.swapClass({
			oldClass: `--${oldValue}`,
			newClass: `--${newValue}`,
		})

		this._view = newValue
	}

	set view(value: TListBoxView) {
		if (this._view !== value) {
			this._applyView(value, this._view)

			this._collection.forEach((item) => {
				item.events.emit('change:view', value)
			})
			;(this.events as TEvented<TListBoxEvents>).emit('change:view', value)
		}
	}

	override getProps(): IListBoxProps {
		return {
			...super.getProps(),
			view: this._view,
		} as IListBoxProps
	}
}

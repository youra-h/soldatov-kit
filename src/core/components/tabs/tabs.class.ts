import { TComponent, type IComponentModelOptions } from '../../base/component'
import { TBaseControl } from '../../base/base-control'
import { TTabItem } from './tab-item/tab-item.class'
import {
	makeSelectableByValue,
	type IHasCollection,
	type ISelectableByValueCollection,
} from '../collection'
import type { ITabs, TTabsEvents } from './types'

/**
 * Коллекция вкладок. single-select по умолчанию.
 */
export abstract class TTabsCustom
	extends TBaseControl<TTabsEvents>
	implements ITabs, IHasCollection<ISelectableByValueCollection<TTabItem>>
{
	protected _collection: ISelectableByValueCollection<TTabItem>

	constructor(options: IComponentModelOptions<ITabs> = {}) {
		options = TComponent.prepareOptions(options, 's-tabs')

		super(options)

		const { props = {} } = options

		const CollCtor = makeSelectableByValue<TTabItem>()
		this._collection = new CollCtor(this, TTabItem, { multiSelect: false })
	}

	get collection() {
		return this._collection
	}

	addTab(props?: Partial<TTabItem>) {
		return this._collection.add(props)
	}

	removeTab(index: number) {
		return this._collection.delete(index)
	}

	clear() {
		return this._collection.clear()
	}

	getTabs(): TTabItem[] {
		return this._collection.toArray()
	}

	getTab(index: number): TTabItem | undefined {
		return this._collection.getItem(index)
	}

	selectTabByIndex(index: number) {
		this._collection.select(index)
	}

	selectTabByName(name: string) {
		return this._collection.selectByName(name)
	}

	selectTabByValue(value: any) {
		return this._collection.selectByValue(value)
	}

	getSelected() {
		return this._collection.getSelected()
	}
}

/**
 * Коллекция вкладок. single-select по умолчанию.
 */
export class TTabs extends TTabsCustom {
	static defaultValues: Partial<ITabs> = {
		...TBaseControl.defaultValues,
	}
}

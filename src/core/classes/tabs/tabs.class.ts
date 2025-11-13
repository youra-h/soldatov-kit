import { TComponent, type IComponentOptions } from './../component'
import { TBaseControl } from '../base-control'
import { TTabItem } from './tab-item/tab-item.class'
import { makeSelectableByValue } from '../collection'
import type { ITabs, TTabsEvents } from './types'

/**
 * Коллекция вкладок. single-select по умолчанию.
 */
export class TTabs extends TBaseControl<TTabsEvents> implements ITabs {
	static defaultValues: Partial<ITabs> = {
		...TBaseControl.defaultValues,
	}

	constructor(options: IComponentOptions<ITabs> = {}) {
		options = TComponent.prepareOptions(options, 's-tabs')

		super(options)

		const { props = {} } = options
	}
}

// makeSelectableByValue<TTabItem>() implements ITabs {
// 	constructor(owner?: any) {
// 		super(owner, TTabItem)
// 	}

// 	/**
// 	 * Выбирает вкладку по индексу.
// 	 * @param index
// 	 */
// 	selectByIndex(index: number): void {
// 		this.select(index)
// 	}
// }

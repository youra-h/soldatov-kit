import { TTabItem } from './tab-item/tab-item.class'
import { makeSelectableByValue } from '../collection'

/**
 * Коллекция вкладок. single-select по умолчанию.
 */
export class TTabs extends makeSelectableByValue<TTabItem>() {
	constructor(owner?: any) {
		super(owner, TTabItem)
	}

	/**
	 * Выбирает вкладку по индексу.
	 * @param index
	 */
	selectByIndex(index: number): void {
		this.select(index)
	}
}

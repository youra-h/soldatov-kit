import { TTabItem } from './tab-item/tab-item.class'
import { makeSelectableByValue } from '../collection'
import type { ITabs } from './types'
import type { TComponentSize } from '@/core/common/types'

/**
 * Коллекция вкладок. single-select по умолчанию.
 */
export class TTabs extends makeSelectableByValue<TTabItem>() implements ITabs {
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

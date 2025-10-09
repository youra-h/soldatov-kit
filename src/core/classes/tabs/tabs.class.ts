import { TTabItem } from './tab-item.class'
import { SelectableControlCollection } from '../collection'

/**
 * Коллекция вкладок. single-select по умолчанию.
 */
export class TabItems extends SelectableControlCollection<TTabItem> {
	constructor(owner?: any) {
		// передаём opts { multi: false } как третий аргумент
		super(owner, TTabItem, { multi: false })
	}

	/**
	 * Удобный метод: выбирает вкладку по индексу.
	 */
	selectByIndex(index: number): void {
		this.select(index)
	}

	/**
	 * Удобный метод: выбирает вкладку по имени (name).
	 */
	selectByName(name: string): void {
		const arr = this.toArray() as TTabItem[]
		const found = arr.find((it) => it.name === name)
		if (found) this.select(found)
	}

	/**
	 * Возвращает первую выбранную вкладку (или undefined).
	 */
	getSelected(): TTabItem | undefined {
		return this.selectedItems[0]
	}
}

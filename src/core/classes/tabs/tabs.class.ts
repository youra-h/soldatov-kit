import { TTabItem } from './tab-item/tab-item.class'
import { SelectableControlCollection } from '../collection'

/**
 * Коллекция вкладок. single-select по умолчанию.
 */
export class Tabs extends SelectableControlCollection<TTabItem>() {
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

	/**
	 * Выбирает вкладку по имени.
	 * @param name
	 * @return true если вкладка с таким именем найдена и выбрана, иначе false.
	 */
	selectByName(name: string): boolean {
		const arr = this.toArray() as TTabItem[]

		const found = arr.find((it) => it.name === name)

		if (!found) return false

		this.select(found)

		return true
	}
}

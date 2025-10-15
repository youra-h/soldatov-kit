import { TTabItem } from './tab-item.class'
import { createSelectableControlCollection } from '../collection'
import { defaultValuesControl } from '../control'

export const defaultValues: Partial<ITabs> = {
	...defaultValuesControl,
	variant: 'primary',
	size: 'normal',
	tag: 'span',
	borderWidth: 'auto',
}

/**
 * Коллекция вкладок. single-select по умолчанию.
 */
export class Tabs extends createSelectableControlCollection<TTabItem>() {
	constructor(owner?: any) {
		// передаём opts { multi: false } как третий аргумент
		super(owner, TTabItem, { multi: false })
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

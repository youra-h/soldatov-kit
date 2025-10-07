import { AbstractControlCollection } from '../control/control-collection.class'
import type { TConstructor } from '../../../common/types'
import { TListItem } from './list.item.class'

/**
 * Коллекция элементов списка, привязанная к владельцу.
 */
export class TListItems extends AbstractControlCollection<TListItem> {
	constructor(owner?: any) {
		super(owner, TListItem as unknown as TConstructor<TListItem>)
	}

	/**
	 * Создаёт элемент с text и добавляет в коллекцию.
	 * @param text Текст элемента
	 */
	addItem(text = ''): TListItem {
		const it = this.addControl()
		it.text = text
		return it
	}

	/**
	 * Создаёт элемент и задаёт набор свойств.
	 * @param props Частичный набор свойств элемента
	 */
	addItemWith(props: Partial<TListItem>): TListItem {
		const it = this.addControl()
		it.assign(Object.assign(new TListItem(), props) as TListItem)
		// или записать вручную: if (props.text) it.text = props.text
		return it
	}
}

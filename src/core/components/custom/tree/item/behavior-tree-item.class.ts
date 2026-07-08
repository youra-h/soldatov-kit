import { TTreeItem } from './tree-item.class'
import { TCollection } from '../../../base/collection'

/**
 * Базовый элемент дерева с подключаемым поведением.
 * Конкретный класс-наследник отвечает за создание инстанса поведения
 * и подписку на его события в своём конструкторе.
 * @template TBehavior Тип поведения (например, TActivatableBehavior)
 */
export class TBehaviorTreeItem<TBehavior extends { events: any }> extends TTreeItem {
	protected _behavior!: TBehavior

	constructor(collection?: TCollection) {
		super(collection)
	}

	get behavior(): TBehavior {
		return this._behavior
	}
}

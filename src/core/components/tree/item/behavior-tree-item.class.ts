import { TTreeItem } from './tree-item.class'
import type { TConstructor } from '../../../common/types'
import { TCollection } from '../../collection/collection.class'

/**
 * Элемент дерева с подключаемым поведением.
 * @template TBehavior Тип класса поведения (например, TActivatableBehavior)
 */
export class TBehaviorTreeItem<TBehavior extends { events: any }> extends TTreeItem {
	protected readonly _behavior: TBehavior

	constructor(BehaviorClass: TConstructor<TBehavior>, collection?: TCollection) {
		super(collection)
		// Создаем инстанс поведения
		this._behavior = new BehaviorClass()

		// Подписываемся на изменения в поведении и транслируем их в дерево
		if (this._behavior.events && typeof this._behavior.events.on === 'function') {
			this._behavior.events.on('change', () => {
				// Сообщаем дереву: "Я изменился, событие 'behaviorChange'"
				this.notifyChange('behaviorChange')
			})
		}
	}

	get behavior(): TBehavior {
		return this._behavior
	}
}

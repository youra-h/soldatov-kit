import { TTreeItem } from './tree-item.class'
import type { TConstructor } from '../../../common/types'
import { TCollection } from '../../collection/collection.class'

/**
 * Элемент дерева с подключаемым поведением.
 * @template TBehavior Тип класса поведения (например, TActivatableBehavior)
 */
export class TBehaviorTreeItem<TBehavior extends { events: any }> extends TTreeItem {
	public readonly behavior: TBehavior

	constructor(BehaviorClass: TConstructor<TBehavior>, collection?: TCollection) {
		super(collection)
		// Создаем инстанс поведения
		this.behavior = new BehaviorClass()

		// Подписываемся на изменения в поведении и транслируем их в дерево
		if (this.behavior.events && typeof this.behavior.events.on === 'function') {
			this.behavior.events.on('change', () => {
				// Сообщаем дереву: "Я изменился, событие 'behaviorChange'"
				this.notifyChange('behaviorChange')
			})
		}
	}
}

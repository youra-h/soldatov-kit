import { type ICollectionItem, type ISelectable } from '../../collection'
import type { IControlValue } from '../../control-value'

export interface ITabItem extends IControlValue, ICollectionItem, ISelectable {
	// Дополнительное свойство, отображающее содержимое вкладки
	content: any
}

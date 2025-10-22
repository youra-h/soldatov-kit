import { type IControlInputItem, type ISelectable } from '../../collection'

export interface ITabItem extends IControlInputItem, ISelectable {
	// Дополнительное свойство, отображающее содержимое вкладки
	content: any
}

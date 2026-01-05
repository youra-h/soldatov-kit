import { type IControlValueItem, type ISelectable } from '../../collection'

export interface ITabItem extends IControlValueItem, ISelectable {
	// Дополнительное свойство, отображающее содержимое вкладки
	content: any
}

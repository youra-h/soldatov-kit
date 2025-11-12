import type { IComponent, TComponentEvents } from '../component'

export interface IBaseControl extends IComponent {
	// Наименование контрола
	name: string
	// Заблокирован ли контрол
	disabled?: boolean
}

export type TBaseControlEvents = TComponentEvents & {
	// Событие изменения состояния disabled
	disabled: (value: boolean) => void
}

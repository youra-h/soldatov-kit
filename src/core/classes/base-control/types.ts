import type { IComponent, TComponentEvents } from '../component'

// Элемент, имеющий имя
export interface IHasName {
	name?: string
}

export interface IBaseControl extends IComponent, IHasName {
	// Заблокирован ли контрол
	disabled?: boolean
}

export type TBaseControlEvents = TComponentEvents & {
	// Событие изменения состояния disabled
	disabled: (value: boolean) => void
}

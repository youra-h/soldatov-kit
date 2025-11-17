import type { IComponent, IComponentProps, IComponentMethods, TComponentEvents } from '../component'

// Элемент, имеющий имя
export interface IHasName {
	name?: string
}

export interface IBaseControlProps extends IComponentProps, IHasName {
	// Заблокирован ли контрол
	disabled?: boolean
}

export interface IBaseControlMethods {
	// Заблокировать контрол
	disable(): void
	// Разблокировать контрол
	enable(): void
}

export type TBaseControlEvents = TComponentEvents & {
	// Событие изменения состояния disabled
	disabled: (value: boolean) => void
}

export interface IBaseControl<
	TProps extends IBaseControlProps = IBaseControlProps,
	TEvents = TBaseControlEvents,
> extends IComponent<TProps, TEvents>,
		IBaseControlMethods {}

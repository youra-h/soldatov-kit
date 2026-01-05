import type { IBaseControl, IBaseControlProps, TBaseControlEvents } from './../base-control'
import type { TComponentSize } from '../../common/types'

export interface IControlProps extends IBaseControlProps {
	// Текстовое значение контрола
	text: string
	// В фокусе ли контрол
	focused?: boolean
	// Размер контрола
	size?: TComponentSize
}

export type TControlEvents = TBaseControlEvents & {
	// Событие изменения фокуса
	focused: (value: boolean) => void
	// Событие изменения текста
	changeText: (value: string) => void
	// Событие клика по контролу
	click: () => void
}

export interface IControl<TProps extends IControlProps = IControlProps, TEvents = TControlEvents>
	extends IBaseControl<TProps, TEvents> {}

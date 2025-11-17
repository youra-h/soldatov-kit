import type { IBaseControlProps, TBaseControlEvents } from './../base-control'
import type { TComponentSize } from '../../common/types'

export interface IControlProps extends IBaseControlProps {
	// Текстовое значение контрола
	text: string
	// В фокусе ли контрол
	focused?: boolean
	// Размер контрола
	size?: TComponentSize
}

export interface IControl extends IControlProps {}

export type TControlEvents = TBaseControlEvents & {
	// Событие изменения фокуса
	focused: () => void
	// Событие изменения текста
	changeText: (value: string) => void
	// Событие клика по контролу
	click: () => void
}

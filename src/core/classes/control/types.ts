import type { IComponent, TComponentEventsMap } from './../component'
import type { TComponentSize } from '../../common/types'

export interface IControl extends IComponent {
	// Текстовое значение контрола
	text: string
	// Заблокирован ли контрол
	disabled?: boolean
	// В фокусе ли контрол
	focused?: boolean
	// Размер контрола
	size?: TComponentSize
}

export type TControlEventsMap = TComponentEventsMap & {
	// Событие изменения фокуса
	focus: () => void
	// Событие изменения текста
	changeText: (value: string) => void
	// Событие клика по контролу
	click: () => void
	// Событие изменения состояния disabled
	disabled: (value: boolean) => void
}

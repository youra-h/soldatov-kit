import type {
	IValueControl,
	IValueControlProps,
	TValueControlEvents,
	TValueControlStatesOptions,
} from '../../../base/value-control'
import type { IStateUnit } from '../../../base/state-unit'
import type { TStateCtor } from '../../../base/states'
import type {
	IActivatableCollectionItem,
	IActivatableCollectionItemProps,
} from '../../../base/collection/activable/types'
import type { TCollectionItemEvents } from '../../../base/collection'

// ============ TTabItemCustom (логика таба без коллекции) ============

export type TTabItemCustomEvents = TValueControlEvents<string | number> & {
	/** change:text */
	'change:text': (value: string) => void
	/** change:badge */
	'change:badge': (value: string | number | undefined) => void
	/** change:closable */
	'change:closable': (value: boolean) => void
	/** close */
	close: () => void
}

export interface ITabItemCustomProps extends IValueControlProps<string | number> {
	/** Текст таба */
	text?: string
	/** Бейдж с числом/текстом */
	badge?: string | number
	/** Можно ли закрыть таб */
	closable?: boolean
}

export type TTabItemCustomStatesOptions = TValueControlStatesOptions<string | number> & {
	text?: TStateCtor<IStateUnit<string>, string> | IStateUnit<string>
	badge?:
		| TStateCtor<IStateUnit<string | number | undefined>, string | number | undefined>
		| IStateUnit<string | number | undefined>
	closable?: TStateCtor<IStateUnit<boolean>, boolean> | IStateUnit<boolean>
}

export interface ITabItemCustom extends IValueControl<string | number, ITabItemCustomProps, TTabItemCustomEvents> {
	/** Текст таба */
	text: string
	/** Бейдж с числом/текстом */
	badge: string | number | undefined
	/** Можно ли закрыть таб */
	closable: boolean
	/** Закрыть таб (emit close event) */
	close(): void
}

// ============ TTabItem (коллекционный элемент с композицией) ============

export type TTabItemEvents = TCollectionItemEvents &
	TTabItemCustomEvents & {
		/** После изменения состояния активности */
		change: (item: any) => void
	}

export interface ITabItemProps extends IActivatableCollectionItemProps, ITabItemCustomProps {
	/** Активен ли таб */
	active: boolean
}

export interface ITabItem extends IActivatableCollectionItem<ITabItemProps, any> {
	/** Текст таба */
	text: string
	/** Уникальный ключ таба (value из TValueControl) */
	value: string | number
	/** Бейдж с числом/текстом */
	badge: string | number | undefined
	/** Можно ли закрыть таб */
	closable: boolean
	/** Закрыть таб (emit close event) */
	close(): void
}

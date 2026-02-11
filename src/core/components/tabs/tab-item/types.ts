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
	/** change:closable */
	'change:closable': (value: boolean | undefined) => void
	/** close */
	close: () => void
}

export interface ITabItemCustomProps extends IValueControlProps<string | number> {
	/** Текст таба */
	text?: string
	/** Можно ли закрыть таб (undefined = наследовать от родителя TTabs) */
	closable?: boolean
}

export type TTabItemCustomStatesOptions = TValueControlStatesOptions<string | number> & {
	text?: TStateCtor<IStateUnit<string>, string> | IStateUnit<string>
	closable?:
		| TStateCtor<IStateUnit<boolean | undefined>, boolean | undefined>
		| IStateUnit<boolean | undefined>
}

export interface ITabItemCustom
	extends IValueControl<string | number, ITabItemCustomProps, TTabItemCustomEvents> {
	/** Текст таба */
	text: string
	/** Можно ли закрыть таб (undefined = наследовать от родителя TTabs) */
	closable: boolean | undefined
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
	// active уже наследуется от IActivatableCollectionItemProps
}

export interface ITabItem extends IActivatableCollectionItem<ITabItemProps, TTabItemEvents> {
	/** Текст таба */
	text: string
	/** Уникальный ключ таба (value из TValueControl) */
	value: string | number
	/** Можно ли закрыть таб (undefined = наследовать от родителя TTabs) */
	closable: boolean | undefined
	/** Закрыть таб (emit close event) */
	close(): void
}

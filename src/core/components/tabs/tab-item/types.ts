import type {
	IValueControl,
	IValueControlProps,
	TValueControlEvents,
	TValueControlStatesOptions,
} from '../../../base/value-control'
import type { IStateUnit } from '../../../base/state-unit'
import type { TStateCtor } from '../../../base/states'
import type {
	IActivatableCollectionItemProps,
	TActivatableItemEvents,
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

/**
 * Интерфейс кастомного таба с generic TProps для гибкости наследования.
 * По умолчанию использует ITabItemCustomProps, но можно переопределить (например, ITabItemProps в ITabItem).
 */
export interface ITabItemCustom<
	TProps extends ITabItemCustomProps = ITabItemCustomProps,
> extends IValueControl<string | number, TProps, TTabItemCustomEvents> {
	/** Текст таба */
	text: string
	/** Можно ли закрыть таб (undefined = наследовать от родителя TTabs) */
	closable: boolean | undefined
	/** Закрыть таб (emit close event) */
	close(): void
}

// ============ TTabItem (коллекционный элемент с композицией) ============

export type TTabItemEvents = TActivatableItemEvents<ITabItem> & TTabItemCustomEvents

export interface ITabItemProps extends IActivatableCollectionItemProps, ITabItemCustomProps {}

/**
 * Интерфейс элемента таба для коллекции.
 * Наследует все UI-свойства от ITabItemCustom<ITabItemProps> + добавляет свойства коллекции.
 * Передаем ITabItemProps в generic, чтобы getProps()/toJSON() вернули правильный тип с active.
 */
export interface ITabItem extends ITabItemCustom<ITabItemProps> {
	/** Признак активности элемента (из коллекции) */
	active: boolean
	/** Ссылка на коллекцию-владелец */
	collection: any | null
	/** Переключить активность */
	toggleActive(): void
	/** Освобождение ресурсов (из коллекции) */
	free(): void
}

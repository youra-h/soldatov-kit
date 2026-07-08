import type {
	IValueControl,
	IValueControlProps,
	TValueControlEvents,
	TValueControlStates,
} from '../../../base/value-control'
import type { IStateUnit } from '../../../../common'
import { type TValuePayload } from '../../../../bridge'
import type {
	IActivatableCollectionItemProps,
	TActivatableItemEvents,
	IActivatableComponentItem,
} from '../../../base/collection'
import type { IComponentViewOptions } from '../../../base/component-view'
import type { TCollectableOptions } from '../../../base/collection'

// ============ TTabItemCustom (логика таба без коллекции) ============

export type TTabItemCustomEvents<TTab = any> = TValueControlEvents<string | number> & {
	/** change:text */
	'change:text': (payload: TValuePayload<string>) => void
	/** change:closable */
	'change:closable': (value: boolean | undefined) => void
	/** close */
	close: (tab: TTab) => void
}

export interface ITabItemCustomProps extends IValueControlProps<string | number> {
	/** Текст таба */
	text?: string
	/** Можно ли закрыть таб (undefined = наследовать от родителя TTabs) */
	closable?: boolean
}

export type TTabItemCustomStates = TValueControlStates<string | number> & {
	text: IStateUnit<string>
	closable: IStateUnit<boolean | undefined>
}

/**
 * Интерфейс кастомного таба с generic TProps для гибкости наследования.
 * По умолчанию использует ITabItemCustomProps, но можно переопределить (например, ITabItemProps в ITabItem).
 */
export interface ITabItemCustom<
	TProps extends ITabItemCustomProps = ITabItemCustomProps,
	TStates extends TTabItemCustomStates = TTabItemCustomStates,
> extends IValueControl<string | number, TProps, TTabItemCustomEvents<any>, TStates> {
	/** Текст таба */
	text: string
	/** Можно ли закрыть таб (undefined = наследовать от родителя TTabs) */
	closable: boolean | undefined
	/** Закрыть таб (emit close event) */
	close(): void
	/** Инжектирует резолвер для наследования через TTabs */
	setClosableResolver(resolver: () => boolean): void
}

// ============ TTabItem (коллекционный элемент с композицией) ============

export type TTabItemOptions = TCollectableOptions<
	IComponentViewOptions<ITabItemProps, TTabItemCustomStates>
>

export type TTabItemEvents = TActivatableItemEvents<ITabItem> & TTabItemCustomEvents<ITabItem>

export interface ITabItemProps extends IActivatableCollectionItemProps, ITabItemCustomProps {}

export interface ITabItem extends ITabItemCustom<ITabItemProps>, IActivatableComponentItem {}

import type {
	IComponentView,
	IComponentViewProps,
	TComponentViewEvents,
	TComponentViewStatesOptions,
} from '../../base/component-view'
import type { TComponentSize, TComponentVariant, TValuePayload } from '../../common/types'
import type { IStateUnit } from '../../common/state-unit'
import type { TStateCtor } from '../../common/states'
import type { ISpinner } from '../spinner'
import type { IIcon } from '../icon'

export type TLoaderIndicator = 'icon' | 'spinner' | 'skeleton'

export interface ILoaderProps extends IComponentViewProps {
	/** Тип индикатора загрузки */
	loader?: TLoaderIndicator
	/** Размер индикатора */
	size?: TComponentSize
	/** Вариант индикатора */
	variant?: TComponentVariant
	/** При visible=true — дизейблить дочерние контролы */
	shouldDisable?: boolean
	/** При visible=true — показывать индикатор загрузки */
	shouldIndicator?: boolean
}

export type TLoaderStatesOptions = TComponentViewStatesOptions & {
	size?: TStateCtor<IStateUnit<TComponentSize>, TComponentSize> | IStateUnit<TComponentSize>
	variant?: TStateCtor<IStateUnit<TComponentVariant>, TComponentVariant> | IStateUnit<TComponentVariant>
}

export type TLoaderEvents = TComponentViewEvents & {
	'change:loader': (value: TLoaderIndicator) => void
	'change:size': (payload: TValuePayload<TComponentSize>) => void
	'change:variant': (payload: TValuePayload<TComponentVariant>) => void
	'change:shouldDisable': (value: boolean) => void
	'change:shouldIndicator': (value: boolean) => void
}

export interface ILoader extends IComponentView<ILoaderProps, TLoaderEvents> {
	/** Тип индикатора */
	loader: TLoaderIndicator
	/** Размер индикатора */
	size: TComponentSize
	/** Вариант индикатора */
	variant: TComponentVariant
	/** Дизейблить дочерние контролы при загрузке */
	shouldDisable: boolean
	/** Показывать индикатор при загрузке */
	shouldIndicator: boolean
	/** Экземпляр индикатора (TSpinner, TIcon, ...) или undefined если не активен */
	readonly indicator: ISpinner | IIcon | undefined
}

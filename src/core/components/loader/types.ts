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

export type TLoaderType = 'icon' | 'spinner' | 'skeleton'

export interface ILoaderProps extends IComponentViewProps {
	/** Тип индикатора загрузки */
	type?: TLoaderType
	/** Размер индикатора */
	size?: TComponentSize
	/** Вариант индикатора */
	variant?: TComponentVariant
	/** Дизейблить дочерние контролы при загрузке */
	block?: boolean
	/** Показывать индикатор при загрузке */
	indicator?: boolean
}

export type TLoaderStatesOptions = TComponentViewStatesOptions & {
	size?: TStateCtor<IStateUnit<TComponentSize>, TComponentSize> | IStateUnit<TComponentSize>
	variant?:
		| TStateCtor<IStateUnit<TComponentVariant>, TComponentVariant>
		| IStateUnit<TComponentVariant>
}

export type TLoaderEvents = TComponentViewEvents & {
	'change:type': (value: TLoaderType) => void
	'change:size': (payload: TValuePayload<TComponentSize>) => void
	'change:variant': (payload: TValuePayload<TComponentVariant>) => void
	'change:block': (value: boolean) => void
	'change:indicator': (value: boolean) => void
}

export interface ILoader extends IComponentView<ILoaderProps, TLoaderEvents> {
	/** Тип индикатора */
	type: TLoaderType
	/** Размер индикатора */
	size?: TComponentSize
	/** Вариант индикатора */
	variant?: TComponentVariant
	/** Дизейблить дочерние контролы при загрузке */
	block: boolean
	/** Показывать индикатор при загрузке */
	indicator: boolean
	/** Экземпляр индикатора (TSpinner, TIcon, ...) или undefined если не активен */
	readonly loader: ISpinner | IIcon | undefined
}

import type { IComponentView, IComponentViewProps, TComponentViewEvents, TComponentViewStatesOptions } from '../../base/component-view'
import type { TComponentSize, TComponentVariant } from '../../common/types'

export type TLoaderIndicator = 'icon' | 'spinner' | 'skeleton'

export interface ILoaderProps extends IComponentViewProps {
	/** Тип индикатора загрузки, передаваемый дочерним контролам */
	loader?: TLoaderIndicator
	/** Размер загрузчика (синхронизируется с дочерним контролом) */
	size?: TComponentSize
	/** Вариант загрузчика (синхронизируется с дочерним контролом) */
	variant?: TComponentVariant
}

export type TLoaderEvents = TComponentViewEvents & {
	'change:loader': (value: TLoaderIndicator) => void
	'change:size': (value: TComponentSize) => void
	'change:variant': (value: TComponentVariant) => void
}

export interface ILoader extends IComponentView<ILoaderProps, TLoaderEvents> {
	loader: TLoaderIndicator
	size: TComponentSize
	variant: TComponentVariant
}

import type {
	IComponentView,
	IComponentViewProps,
	TComponentViewEvents,
} from '../../base/component-view'
import type { TComponentSize, TComponentVariant } from '../../common/types'

export interface ISpinnerProps extends IComponentViewProps {
	// Размер компонента
	size?: TComponentSize
	// Вариант отображения компонента
	variant?: TComponentVariant
	// Толщина бордера
	borderWidth?: number | 'auto'
}

export type TSpinnerEvents = TComponentViewEvents & {}

export interface ISpinner extends IComponentView<ISpinnerProps, TSpinnerEvents> {
	size: TComponentSize
	variant: TComponentVariant
}

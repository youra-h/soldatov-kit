import type { IEntity } from '../entity'
import { TEvented } from '../../common/evented'

export type TComponentModelEvents = {
	/** Создан (после конструктора, async). */
	created: (component: IComponentModel) => void
}

export interface IComponentModelProps {
	id?: string | number
}

export interface IComponentModelMethods {
	// intentionally empty
}

export interface IComponentModel<
	TProps extends IComponentModelProps = IComponentModelProps,
	TEvents extends Record<string, (...args: any) => any> = TComponentModelEvents,
>
	extends IEntity<TProps>, IComponentModelMethods {
	readonly events: TEvented<TEvents>
}

/**
 * Опции для создания компонента.
 * props — начальные свойства, baseClass — базовый CSS-класс.
 */
export interface IComponentModelOptions<T> {
	props?: Partial<T>
	baseClass?: string
}

import type { IEntity } from '../entity'
import { TEvented } from '../../common/evented'
import type { IStateUnit } from '../../common/state-unit'

export type TComponentEvents = {
	/** Создан (после конструктора, async). */
	created: (component: IComponent) => void
}

export interface IComponentProps {
	id?: string | number
}

export interface IComponentMethods {
	// intentionally empty
}

export interface IComponent<
	TProps extends IComponentProps = IComponentProps,
	TEvents extends Record<string, (...args: any) => any> = TComponentEvents,
	TStates extends Record<string, IStateUnit<any>> = Record<string, IStateUnit<any>>,
>
	extends IEntity<TProps>, IComponentMethods {
	readonly events: TEvented<TEvents>
	readonly states: TStates
}

/**
 * Опции для создания компонента.
 * props — начальные свойства.
 * states — инъекция state-реализаций.
 */
export interface IComponentOptions<TProps, TStates = any> {
	props?: Partial<TProps>
	/**
	 * Инъекция state-реализаций.
	 * Нужна, чтобы менять поведение state свойств без оверрайда геттеров/сеттеров.
	 */
	states?: Partial<TStates>
}

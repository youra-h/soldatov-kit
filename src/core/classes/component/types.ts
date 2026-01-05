import type { IEntity } from '../entity'
import { TEvented } from '../../common/evented'

/**
 * События компонента.
 * Используются через TEvented.
 */
export type TComponentEvents = {
	created: (component: IComponent) => void
	show: (component: IComponent) => void
	hide: () => void
	beforeShow: () => boolean
	afterShow: () => void
	beforeHide: () => boolean
	afterHide: () => void
	visible: (visible: boolean) => void
}

/**
 * Свойства компонента (состояние).
 * Здесь описываются только данные, без методов.
 */
export interface IComponentProps {
	// Id компонента
	id?: string | number
	// HTML-тег компонента
	tag?: string | Entity
	// Видимость компонента
	visible?: boolean
	// Скрытие компонента / удаление из dom
	hidden?: boolean
}

/**
 * Методы компонента (поведение).
 * Здесь описываются только функции, которые управляют состоянием.
 */
export interface IComponentMethods {
	// Показать компонент
	show(): void
	// Действие перед показом компонента, если возвращает false, показ не происходит
	beforeShow(): boolean
	// Действие после показа компонента
	afterShow(): void
	// Скрыть компонент
	hide(): void
	// Действие перед скрытием компонента, если возвращает false, скрытие не происходит
	beforeHide(): boolean
	// Действие после скрытия компонента
	afterHide(): void
}

// Универсальный IComponent с дженериками:
// TProps — props, обязательно содержит базовые IComponentProps
// TEvents — события, по умолчанию TComponentEvents
export interface IComponent<
	TProps extends IComponentProps = IComponentProps,
	TEvents extends Record<string, (...args: any) => any> = TComponentEvents,
> extends IEntity<TProps>,
		IComponentMethods {
	// CSS-классы компонента
	readonly classes?: string[]
	// События компонента
	readonly events?: TEvented<TEvents>
}

/**
 * Опции для создания компонента.
 * props — начальные свойства, baseClass — базовый CSS-класс.
 */
export interface IComponentOptions<T> {
	props?: Partial<T>
	baseClass?: string
}

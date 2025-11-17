import type { IObject, TObjectProps } from '../object'

/**
 * Свойства компонента (состояние).
 * Здесь описываются только данные, без методов.
 */
export interface IComponentProps {
	// Управляющий объект компонента (например, ссылка на контроллер)
	is?: Object
	// Id компонента
	id?: string | number
	// HTML-тег компонента
	tag?: string | Object
	// Видимость компонента
	visible?: boolean
	// Скрытие компонента / удаление из dom
	hidden?: boolean
	// CSS-классы компонента
	readonly classes?: string[]
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

/**
 * Объединённый интерфейс компонента.
 * Наследует контракт IObject для работы с props.
 */
export interface IComponent extends IObject<IComponentProps>, IComponentProps, IComponentMethods {}

/**
 * Опции для создания компонента.
 * props — начальные свойства, baseClass — базовый CSS-класс.
 */
export interface IComponentOptions<T> {
	props?: Partial<T>
	baseClass?: string
}

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

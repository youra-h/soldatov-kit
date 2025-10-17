import type { IObject } from '../object'

export interface IComponent extends IObject {
	// Управляющий объект компонента
	is?: Object
	// Id компонента
	id?: string | number
	// HTML-тег компонента
	tag?: string | Object
	// Видимость компонента
	visible?: boolean
	// Скрытие компонента / удаление из dom
	hidden?: boolean
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
	// CSS-классы компонента
	readonly classes?: string[]
}

export interface IComponentOptions<T> {
	props?: Partial<T>
	baseClass?: string
}

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

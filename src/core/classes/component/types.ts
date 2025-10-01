export interface IComponent {
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
}

export interface IComponentOptions<T> {
	props: Partial<T>
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

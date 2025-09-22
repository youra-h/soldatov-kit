export interface IComponent {
	// Id компонента
	id?: string | number
	// HTML-тег компонента
	tag?: string | Object
	// Видимость компонента
	visible?: boolean
	// Скрытие компонента / удаление из dom
	hidden?: boolean
}

export type TComponentEventsMap = {
	show: () => void
	hide: () => void
	beforeShow: () => boolean
	afterShow: () => void
	beforeHide: () => boolean
	afterHide: () => void
	visible: (visible: boolean) => void
}

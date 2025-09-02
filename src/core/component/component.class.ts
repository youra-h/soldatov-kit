import { TObject } from '../object/object.class'
import type { IComponent, TComponentEventsMap } from './types'

export default class TComponent<TEvents extends TComponentEventsMap>
	extends TObject<TEvents>
	implements IComponent
{
	private _id: string | number
	private _visible: boolean
	private _hidden: boolean

	constructor(props: Partial<IComponent> = {}) {
		super()

		this._id = props.id ?? ''
		this._visible = props.visible ?? true
		this._hidden = props.hidden ?? false
	}

	get id(): string | number {
		return this._id
	}

	set id(value: string | number) {
		this._id = value
	}

	get visible(): boolean {
		return this._visible
	}

	set visible(value: boolean) {
		this._visible = value
	}

	get hidden(): boolean {
		return this._hidden
	}

	set hidden(value: boolean) {
		this._hidden = value
	}

	/**
	 * Показать компонент
	 */
	show(): void {
		if (!this.beforeShow()) {
			return
		}

		this._visible = true

		this.emit('show')
		this.emit('visible', true)

		this.afterShow()
	}

	/**
	 * Скрыть компонент
	 */
	hide(): void {
		if (!this.beforeHide()) {
			return
		}

		this._visible = false

		this.emit('hide')
		this.emit('visible', false)

		this.afterHide()
	}

	beforeShow(): boolean {
		return true
	}

	afterShow(): void {}

	beforeHide(): boolean {
		return true
	}

	afterHide(): void {}

	/**
	 * Компонент скрыт и удален из Dom
	 */
	isHidden(): boolean {
		return this._hidden ? this._visible : true
	}

	/**
	 * Компонент видим и не удален из Dom
	 */
	isVisibility(): boolean {
		return this._hidden ? true : this._visible
	}
}

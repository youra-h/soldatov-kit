import { TObject, type TObjectProps } from '../object'
import type { IComponent, TComponentEventsMap } from './types'

export const defaultValues: Partial<IComponent> = {
	id: '',
	visible: true,
	hidden: false,
}

export default class TComponent<TEvents extends TComponentEventsMap>
	extends TObject<TEvents>
	implements IComponent
{
	private _id: string | number
	private _visible: boolean
	private _hidden: boolean

	constructor(props: Partial<IComponent> = {}) {
		super()

		this._id = props.id ?? defaultValues.id!
		this._visible = typeof props.visible === 'boolean' ? props.visible : defaultValues.visible!
		this._hidden = typeof props.hidden === 'boolean' ? props.hidden : defaultValues.hidden!
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
		if (value) {
			this.show()
		} else {
			this.hide()
		}
	}

	get hidden(): boolean {
		return this._hidden
	}

	set hidden(value: boolean) {
		this._hidden = value
	}

	getProps(): TObjectProps {
		return {
			...super.getProps(),
			id: this._id,
			visible: this._visible,
			hidden: this._hidden,
		}
	}

	/**
	 * Показать компонент
	 */
	show(): void {
		if (!this.beforeShow()) {
			return
		}

		const canShow = this.emitWithResult('beforeShow')
		if (!canShow) {
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

		const canShow = this.emitWithResult('beforeHide')
		if (!canShow) {
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
